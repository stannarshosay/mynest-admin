import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AddAgentAnnouncementComponent } from 'src/app/dialogs/add-agent-announcement/add-agent-announcement.component';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-agent-announcements',
  templateUrl: './agent-announcements.component.html',
  styleUrls: ['./agent-announcements.component.css']
})
export class AgentAnnouncementsComponent implements OnInit {

  isGettingAnnouncements:boolean = false;
  isGettingAnnouncementsSuccess:boolean = true;
  announcements:any[]=[];

  constructor(
    private agentService:AgentService,
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
    this.agentService.getAllAnnouncements().subscribe(res=>{
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
    const dialogRef = this.dialog.open(AddAgentAnnouncementComponent);    

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
    this.agentService.deleteAnnouncementById(announcementId).subscribe(res=>{
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
