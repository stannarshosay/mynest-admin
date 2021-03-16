import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  contactData:any = "";
  webSocketEndPoint: string = 'https://mynestonline.com/collection/ws';
  stompClient:any = null;
  public hasRecievedNotification = new Subject<any>();
  constructor(
    private http:HttpClient
  ) { }
 
  getNotificationsUnreadCount(userId:string):Observable<any>{
    return this.http.get("https://mynestonline.com/collection/api/notifications/count?userId="+userId); 
  }
  getAllNotifications(userId:string,pageNo:number,pageSize:number):Observable<any>{
    return this.http.get("https://mynestonline.com/collection/api/get-notifications?userId="+userId+"&pageNo="+pageNo+"&pageSize="+pageSize); 
  }
  updateNotificationReadStatus(notificationIds:any):Observable<any>{
    return this.http.put("https://mynestonline.com/collection/api/notifications/update",notificationIds); 
  }
  getRecievedNotification():Observable<any>{
    return this.hasRecievedNotification.asObservable();
  }
  //websocket
  connectAndSubscribeToWebsocket(){
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    // this.stompClient.debug = () => {};
    let that = this;
    this.stompClient.connect({},function(frame:any) {      
     that.stompClient.subscribe("/user/" + localStorage.getItem("aid") + "/queue/notification",function(notification:any)
       {
        that.hasRecievedNotification.next(JSON.parse(notification["body"]));
        that.playNotificationAudio();
       }       
     ); 
    }, this.errorCallBack);
  } 
  playNotificationAudio(){
    let audio = new Audio();
    audio.src = "../../assets/sounds/notify.wav";
    audio.load();
    audio.play();
  }
  errorCallBack(error:any) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
        this.connectAndSubscribeToWebsocket();
    }, 5000);
  }  
  disconnectFromWebsocket(){
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected!");
  }
}
