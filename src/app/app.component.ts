import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChangePasswordComponent } from './dialogs/change-password/change-password.component';
import { NotificationsComponent } from './dialogs/notifications/notifications.component';
import { LoginService } from './services/login.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mynest-admin';
  isFullPage:boolean = false;
  isLoggedIn:boolean = false;
  notificationCount:any = "0";
  getLoginSetStatusSubscription:Subscription;
  getRecievedNotificationsSubscription:Subscription;
  constructor(
    private router:Router,
    private loginService:LoginService,
    private socketService:SocketService,
    private dialog:MatDialog
  ) {} 
  ngOnInit():void{
    this.getLoginSetStatusSubscription = this.loginService.getLoginSetStatus().subscribe(res =>{
      this.isLoggedIn = res;
      if(res){
        this.socketService.connectAndSubscribeToWebsocket();
      }else{
        this.socketService.disconnectFromWebsocket();
      }
    });
    this.getRecievedNotificationsSubscription = this.socketService.getRecievedNotification().subscribe(res =>{
      if(this.isLoggedIn){
        this.setNotificationUnreadCount();
      }
    });
    if(this.isLoggedIn){
      this.setNotificationUnreadCount();
    }else{
      this.notificationCount = "0";
    }
  }
  ngOnDestroy():void{
    this.getLoginSetStatusSubscription.unsubscribe();
    this.getRecievedNotificationsSubscription.unsubscribe();
  }
   ngAfterContentChecked():void{
     let page = this.router.url;
     switch(page){      
       case "/login":{
        this.isFullPage = true;
        break;
      }      
       default:{
        this.isFullPage = false;
        break;
       }
     }       
   }
   setNotificationUnreadCount(){
    this.socketService.getNotificationsUnreadCount(localStorage.getItem("aid")).subscribe(res=>{
      if(res["success"]){
        this.notificationCount = res["data"]>50?"50+":res["data"];
      }
    }); 
  }
   logout(){
    localStorage.setItem("aid","");
    this.loginService.hasLoggedIn.next(false);
    this.socketService.hasRecievedNotification.next("no");
    this.router.navigate(["login"]);
   }
   openNotifications(){
    const dialogRef = this.dialog.open(NotificationsComponent);

    dialogRef.afterClosed().subscribe(result => {
      // console.log("forgot password closed");
    });
   }
   openChangePassword(){
    const dialogRef = this.dialog.open(ChangePasswordComponent);

    dialogRef.afterClosed().subscribe(result => {
      // console.log("forgot password closed");
    });
   }
}
