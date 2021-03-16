import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from 'src/app/dialogs/forgot-password/forgot-password.component';
import { LoginService } from 'src/app/services/login.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLogging:boolean = false;
  username = new FormControl("",Validators.required);
  password = new FormControl("",Validators.required);

  constructor(
    private snackBar: MatSnackBar,
    private loginService:LoginService,
    private socketService:SocketService,
    public dialog:MatDialog,
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  login(){
    this.isLogging = true;
    if(this.username.valid&&this.password.valid){
      this.loginService.login(this.username.value,this.password.value).subscribe(res =>{
        this.isLogging = false;
        if(res["success"]){
          localStorage.setItem("aid",res["data"]["id"]);
          this.loginService.hasLoggedIn.next(true);
          this.socketService.hasRecievedNotification.next("no");
          this.showSnackbar(res["message"]);
          this.router.navigate(["vendors"]);
        }else{
          this.showSnackbar("Oops! "+res["message"]);
        }
      },
      error=>{
        this.isLogging = false;
        this.showSnackbar("Oops! "+error["error"]["message"]);
      });
    }else{
      this.isLogging = false;
      this.showSnackbar("Oops! no credentials entered");
    }
  }

  showSnackbar(content:string){
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.panelClass = ['snackbar-styler'];
    this.snackBar.open(content, "close", config);
  }
  forgotPassword(){
    const dialogRef = this.dialog.open(ForgotPasswordComponent);

    dialogRef.afterClosed().subscribe(result => {
      // console.log("forgot password closed");
    });
  }

}
