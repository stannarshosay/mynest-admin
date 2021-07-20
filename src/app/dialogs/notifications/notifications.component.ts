import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';
import moment from 'moment';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
 
  isNotificationsLoaded:boolean = false;
  isNotificationsDataSuccess:boolean = true;
  notifications:any[] = [];
  notificationPageNo:number = 0;
  notificationPageSize:number = 6;
  notificationConfig:any = {};
  getRecievedNotificationSubscription:Subscription;
  getLoginSetStatus:Subscription;
  constructor(
    private socketService:SocketService,
    private snackBar:MatSnackBar,
    public dialogRef: MatDialogRef<NotificationsComponent>,
    private router:Router
  ) { }

  ngOnInit(): void {   
    this.getNotifications(this.notificationPageNo,this.notificationPageSize);
    this.getRecievedNotificationSubscription = this.socketService.getRecievedNotification().subscribe(res=>{
      if(res !== "no"){        
        this.getNotifications(this.notificationPageNo,this.notificationPageSize);        
      }
    });    
  }
  ngOnDestroy():void{
     this.getRecievedNotificationSubscription.unsubscribe();
  }
  getNotifications(pageNo:number,pageSize:number){
    this.notifications = [];
    this.notificationConfig["totalItems"] = 0;
    this.notificationConfig["id"] = "notificationPagination";
    this.isNotificationsDataSuccess = true;
    this.isNotificationsLoaded = false;
    this.notificationConfig["currentPage"] = pageNo+1;
    this.notificationConfig["itemsPerPage"] = pageSize;
    this.socketService.getAllNotifications(localStorage.getItem("aid"),pageNo,pageSize).subscribe(res =>{
      this.isNotificationsLoaded = true;
      if(res["success"]){
        this.notificationConfig["totalItems"] = res["data"]["totalElements"];        
        this.notifications = res["data"]["content"].map(obj=>{
          obj.createdDate = this.getBeautifiedDate(obj.createdDate);
          return obj;
        });
        this.updateReadStatus();
      }else{
        this.isNotificationsDataSuccess = false;
      }
    });
  }
  getBeautifiedDate(dateString:string){
    let date = moment(dateString, "DD/MM/YYYY HH:mm:ss");
    if(date.isSame(moment(),'day')){
      return "Today " + date.format('h:mm a');
    }
    if(date.isSame(moment().subtract(1,"days"),'day')){      
      return "Yesterday " + date.format('h:mm a');
    }
    return date.format('Do MMM YYYY h:mm a');
  }
  updateReadStatus(){
    let paramData = {};
    paramData["notificationIds"] = this.notifications.filter((obj)=>{
      if(!obj.readStatus)
      return obj;
    }).map((obj)=>{
      return obj.notificationId;
    });
    if(paramData["notificationIds"].length){
      this.socketService.updateNotificationReadStatus(paramData).subscribe(res=>{
          this.socketService.hasRecievedNotification.next("no"); 
      },error=>{
        this.showSnackbar("Status update connection error!",true,"close");
      });
    }
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  notificationPageChange(newPage: number){
    this.notificationPageNo = newPage-1;
    this.getNotifications(this.notificationPageNo,this.notificationPageSize);
  } 
  goToRespectivePage(notificationType:string){
      switch(notificationType){
        case "NEW_AD_REQUEST" :{
          this.router.navigateByUrl("/requested-ads");
          break;
        }
        case "NEW_REGISTRATION" :{
          this.router.navigateByUrl("/vendors");
          break;
        }
        case "REQUIREMENT_REPORT" :{
          this.router.navigateByUrl("/reported-requirements");
          break;
        }
        case "VENDOR_REPORT" :{
          this.router.navigateByUrl("/reported-vendors");
          break;
        }
        case "AGENT_ADD_REQUEST" :{
          this.router.navigateByUrl("/agent-add-requests");
          break;
        }
        case "AGENT_REMOVE_REQUEST" :{
          this.router.navigateByUrl("/agent-remove-requests");
          break;
        }
      }
  }
}
