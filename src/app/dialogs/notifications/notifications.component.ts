import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';

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
    public dialogRef: MatDialogRef<NotificationsComponent>
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
        this.notifications = res["data"]["content"];
        this.updateReadStatus();
      }else{
        this.isNotificationsDataSuccess = false;
      }
    });
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
}
