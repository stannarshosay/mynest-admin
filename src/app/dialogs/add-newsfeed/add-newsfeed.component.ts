import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NewsfeedService } from 'src/app/services/newsfeed.service';

@Component({
  selector: 'app-add-newsfeed',
  templateUrl: './add-newsfeed.component.html',
  styleUrls: ['./add-newsfeed.component.css']
})
export class AddNewsfeedComponent implements OnInit {

  isAdding:boolean = false;
  imagePreview = [];
  imageFile:File=null;
  newsForm:FormGroup;
  progress:number = 0;
  constructor(
    public dialogRef: MatDialogRef<AddNewsfeedComponent>,
    private snackBar:MatSnackBar,
    private newsfeedService:NewsfeedService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
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
  addNewsfeed(){
    if(this.imageFile){
        if(this.newsForm.valid){
        this.isAdding = true;
        this.showSnackbar("Please be patient! adding category...",false,"");
        let paramData = this.newsForm.value;
        const uploadData = new FormData();
        uploadData.append('image', this.imageFile);
        uploadData.append('newsfeed',new Blob([JSON.stringify(paramData)], { type: "application/json"}));
        this.newsfeedService.createNewsfeed(uploadData).subscribe((event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              this.progress = 1;
              break;
            case HttpEventType.ResponseHeader:
              break;
            case HttpEventType.UploadProgress:
              this.progress = Math.round(event.loaded / event.total * 100);
              break;
            case HttpEventType.Response:
              this.isAdding = false;
              if(event.body["success"]){                 
                this.imageFile = null;
                this.dialogRef.close(true);
              }else{
                this.showSnackbar("Server error",true,"close");
              }
              setTimeout(() => {
                this.progress = 0;
              }, 1500);
              break;
            default:
              this.progress = 0;
              return `Unhandled event: ${event.type}`;
          }
        },error=>{
            console.log(error);
            this.progress = 0;
            this.isAdding = false;
            this.showSnackbar("Connection Error!",true,"close");
        });
      }else{
        this.showSnackbar("Please fill all fields",true,"close");
      }
    }else{
      this.showSnackbar("Please select an image",true,"close");
    }
  }
  
  onImageSelect(event:any,fileInput:any){
    this.imagePreview = [];
    this.imageFile = event.target.files[0];  
    var reader = new FileReader();   
    reader.onload = (event:any) => {
      this.imagePreview.push(event.target.result);  
    } 
    reader.readAsDataURL(event.target.files[0]);
  }

}
