import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {

customerData:any;  
customerId:any;
isGettingProfileDetails:boolean = true;
isChanging:boolean = false;
isUploading:boolean = false;
isEnabled:boolean;
isToggling:boolean = true;
changePasswordForm: FormGroup;


profilePreview = [];
profileProgress:number = 0;
profileFile:File=null;

constructor(
  private route:ActivatedRoute,
  private customerService:CustomerService,
  private snackBar:MatSnackBar,
  private fb:FormBuilder
) { }

ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    this.customerId= params.get('customerId');
  });
  this.changePasswordForm = this.fb.group({
    password: ['', Validators.required],
    repassword:['',Validators.required]
  });
  this.getCustomerDetails();
}
showSnackbar(content:string,hasDuration:boolean,action:string){
  const config = new MatSnackBarConfig();
  if(hasDuration){
    config.duration = 3000;
  }
  config.panelClass = ['snackbar-styler'];
  return this.snackBar.open(content, action, config);
}
getCustomerDetails(){
  this.isGettingProfileDetails = true;
  this.customerService.fetchCustomerById(this.customerId).subscribe(res=>{
    this.isGettingProfileDetails = false;
    if(res["success"]){
      this.customerData = res["data"];
      this.isEnabled = res["data"]["enabled"];
      this.isToggling = false;
      if((res["data"]["profilePic"])&&(res["data"]["profilePic"]!="")){
        this.profilePreview.push("https://mynestonline.com/collection/images/customer-profile/"+encodeURIComponent(res["data"]["profilePic"]));
      }
    }else{
      this.showSnackbar("Customer detail error!",true,"close");
    }
  },error=>{
    this.isGettingProfileDetails = false;
    this.showSnackbar("Connection error!",true,"close");
  });
}
changePassword(){
  if(this.changePasswordForm.valid){
    if(this.changePasswordForm.get("password").value==this.changePasswordForm.get("repassword").value){
      this.showSnackbar("Changing password...",false,"");
      this.isChanging = true;
      let formData = {};
      formData["newPassword"]=this.changePasswordForm.get("password").value;
      formData["userId"]=this.customerId;
      this.customerService.changePassword(formData).subscribe(res=>{
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

onProfileSelect(event:any){
  var _size = event.target.files[0].size;
  var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),i=0;
      while(_size>900)
      {
        _size/=1024;
        i++;
      }
  if((((Math.round(_size*100)/100)>500)&&(i==1))||(i==3)||(i==2)){
    this.showSnackbar("File size is larger than 500 KB",true,"okay");
  }else{
    this.profileFile = event.target.files[0];
    if(this.profileFile){  
      this.uploadProfilePic(event);
    }
  }
}  
uploadProfilePic(fileEvent:any){
  this.isUploading =true;
  this.showSnackbar("Please be patient! uploading profile pic...",true,"okay");
  const uploadData = new FormData();
  uploadData.append('profilePic', this.profileFile);
  this.customerService.uploadProfilePic(uploadData,this.customerId).subscribe(
  (event: HttpEvent<any>) => {
    switch (event.type) {
      case HttpEventType.Sent:
        this.profilePreview = [];
        this.profileProgress = 1;
        break;
      case HttpEventType.ResponseHeader:
        break;
      case HttpEventType.UploadProgress:
        this.profileProgress = Math.round(event.loaded / event.total * 100);
        break;
      case HttpEventType.Response:
        this.isUploading = false;
        if(event.body["success"]){
          this.showSnackbar("Uploaded profile pic",true,"close");           
          this.profileFile = null;
          var reader = new FileReader();   
          reader.onload = (event:any) => {
            this.profilePreview.push(event.target.result);  
          } 
          reader.readAsDataURL(fileEvent.target.files[0]);
        }else{
          this.showSnackbar("Server error",true,"close");
        }
        setTimeout(() => {
          this.profileProgress = 0;
        }, 1500);
        break;
      default:
        this.profileProgress = 0;
        return `Unhandled event: ${event.type}`;
    }
  },error=>{
      this.profileProgress = 0;
      this.isUploading = false;
      this.showSnackbar("Connection Error!",true,"close");
  }); 
}

changeActiveStatus(event:any){
    this.isToggling = true;
    this.showSnackbar(this.isEnabled?"Deactivating...":"Activating...",false,"");
    let paramData = {};
    paramData["id"] = this.customerId;
    paramData["enabled"] = !this.isEnabled;
    this.customerService.toggleActiveStatus(paramData).subscribe(res=>{
      this.isToggling =false;
      if(res["success"]){
        this.showSnackbar(this.isEnabled?"Deactivated successfully!":"Activated successfully!",true,"close");     
        this.isEnabled = !this.isEnabled;   
      }else{
        event.source.checked = this.isEnabled;
        this.showSnackbar("Toggle status server error!",true,"close");
      }
    },error=>{
      this.isToggling = false;
      event.source.checked = this.isEnabled;
      this.showSnackbar("Toggle status connection error!",true,"close");
    });

 }
}
