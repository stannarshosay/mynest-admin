import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  isChanging:boolean = false;
  changePasswordForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private snackBar:MatSnackBar,
    private loginService:LoginService,
    private fb:FormBuilder
  ) { }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      password: ['', Validators.required],
      repassword:['',Validators.required]
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
  changePassword(){
    if(this.changePasswordForm.valid){
      if(this.changePasswordForm.get("password").value==this.changePasswordForm.get("repassword").value){
        this.showSnackbar("Changing password...",false,"");
        this.isChanging = true;
        let formData = {};
        formData["newPassword"]=this.changePasswordForm.get("password").value;
        formData["userId"]=localStorage.getItem("aid");
        this.loginService.changePassword(formData).subscribe(res=>{
          this.isChanging = false;
          if(res["success"]){
            this.changePasswordForm.reset();
            this.showSnackbar("Password changed successfully!",true,"close");
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
        },error=>{
          this.isChanging = false;
          this.showSnackbar("Connection error!",true,"close");
        });
      }else{
        this.showSnackbar("Password don't match!",true,"okay");
      }      
    }else{
      this.showSnackbar("Please fill all required fields",true,"okay");
    }     
  }

}
