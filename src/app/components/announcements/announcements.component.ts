import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AddAnnouncementComponent } from 'src/app/dialogs/add-announcement/add-announcement.component';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css']
})
export class AnnouncementsComponent implements OnInit {

  isGettingAnnouncements:boolean = false;
  isGettingAnnouncementsSuccess:boolean = true;
  announcements:any[]=[];

  constructor(
    private loginService:LoginService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {    
    this.getAllAnnouncements();
  }
  ngOnDestroy():void{
  }  
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  getAllAnnouncements(){
    this.isGettingAnnouncements = true;
    this.isGettingAnnouncementsSuccess = true;
    this.loginService.getAllAnnouncements().subscribe(res=>{
      this.isGettingAnnouncements = false;
      if(res["success"]){
        this.announcements = res["data"];
      }else{
        this.isGettingAnnouncementsSuccess = false;
        this.showSnackbar("Announcements not found!",true,"close");
      }
    },error=>{
      this.isGettingAnnouncements = false;
      this.isGettingAnnouncementsSuccess = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  
  openAddAnnouncement(){
    const dialogRef = this.dialog.open(AddAnnouncementComponent);    

    dialogRef.afterClosed().subscribe(result => {
      if(result){        
        this.showSnackbar("Announcement added successfully!",true,"close");
        this.announcements = [];
        this.getAllAnnouncements();
      }
    });    
  }  
  
  deleteAnnouncement(announcementId:string){
    this.showSnackbar("Deleting, please wait..",false,"");
    this.loginService.deleteAnnouncementById(announcementId).subscribe(res=>{
      if(res["success"]){
        this.showSnackbar("Announcement deleted!",true,"");
        this.announcements = [];
        this.getAllAnnouncements();
      }else{        
        this.showSnackbar("Deletion server error!",true,"close");
      }
    },error=>{
      this.showSnackbar("Deletion Connection error!",true,"close");
    });
  }
}
