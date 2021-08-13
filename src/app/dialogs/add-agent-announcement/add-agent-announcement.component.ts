import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-add-agent-announcement',
  templateUrl: './add-agent-announcement.component.html',
  styleUrls: ['./add-agent-announcement.component.css']
})
export class AddAgentAnnouncementComponent implements OnInit {
  isAdding:boolean = false;
  announcementForm:FormGroup;
  maxChars:string = "500";
  constructor(
    public dialogRef: MatDialogRef<AddAgentAnnouncementComponent>,
    private snackBar:MatSnackBar,
    private agentService:AgentService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.announcementForm = this.fb.group({
      message:["",Validators.required]
    });
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  } 
  
  addAnnouncement(){
    if(this.announcementForm.valid){
      this.isAdding = true;
      this.showSnackbar("Please be patient! adding announcement...",false,"");
      let paramData = this.announcementForm.value;
      this.agentService.addAnnouncement(paramData).subscribe(res=>{
          this.isAdding = false;
          if(res["success"]){
            this.dialogRef.close(true);
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
      },error=>{  
        this.isAdding = false;       
        this.showSnackbar("Connection error!",true,"close");
      });
    }else{
      this.showSnackbar("Please fill all fields",true,"close");
    }
    
  }

}
