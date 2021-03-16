import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrls: ['./add-announcement.component.css']
})
export class AddAnnouncementComponent implements OnInit {
  isAdding:boolean = false;
  announcementForm:FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddAnnouncementComponent>,
    private snackBar:MatSnackBar,
    private loginService:LoginService,
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
      this.loginService.addAnnouncement(paramData).subscribe(res=>{
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
