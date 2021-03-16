import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AdvertisementService } from 'src/app/services/advertisement.service';

@Component({
  selector: 'app-home-ads',
  templateUrl: './home-ads.component.html',
  styleUrls: ['./home-ads.component.css']
})
export class HomeAdsComponent implements OnInit {

  bottomGalleryMaxCount:number = 4;
  topGalleryMaxCount:number = 4;
  
  isGettingTopGalleryDetails:boolean = false;
  isGettingBottomGalleryDetails:boolean = false;

  isUploading:boolean = false;

  existingTopGallery = [];
  existingBottomGallery = [];

  galleryTopProgress:number = 0;
  galleryBottomProgress:number = 0;

  galleryTopFiles:File[] = [];
  galleryBottomFiles:File[] = [];


  constructor(
    private snackBar:MatSnackBar,
    private adService:AdvertisementService
  ) { }

  ngOnInit(): void {
    this.getTopGalleryImages();
    this.getBottomGalleryImages();
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
 
  getTopGalleryImages(){
    this.existingTopGallery = [];
    this.isGettingTopGalleryDetails = true;
    this.adService.getHomeGalleryImagesByType("HOME_BANNER").subscribe(res=>{
      this.isGettingTopGalleryDetails = false;
       if(res["success"]){
          this.topGalleryMaxCount = 4 - res["data"].length;
          this.existingTopGallery = res["data"];
       }
    },error=>{
      this.isGettingTopGalleryDetails = false;
      this.showSnackbar("Top ads connection error!",true,"close");
    })
  }
  getBottomGalleryImages(){
    this.existingBottomGallery = [];
    this.isGettingBottomGalleryDetails = true;
    this.adService.getHomeGalleryImagesByType("HOME_BANNER_BOTTOM").subscribe(res=>{
      this.isGettingBottomGalleryDetails = false;
       if(res["success"]){
          this.bottomGalleryMaxCount = 4 - res["data"].length;
          this.existingBottomGallery = res["data"];
       }
    },error=>{
      this.isGettingBottomGalleryDetails = false;
      this.showSnackbar("Top ads connection error!",true,"close");
    })
  }
  
  onTopGallerySelect(event:any){
    this.galleryTopFiles = event.target.files;
    if(this.galleryTopFiles.length){
      if(this.galleryTopFiles.length > this.topGalleryMaxCount){
        this.showSnackbar("Oops! max "+this.topGalleryMaxCount+" more ad images",true,"close");
      }else{
        this.uploadTopGalleryPic(event);       
      }
    }    
  }
  onBottomGallerySelect(event:any){
    this.galleryBottomFiles = event.target.files;
    if(this.galleryBottomFiles.length){
      if(this.galleryBottomFiles.length > this.bottomGalleryMaxCount){
        this.showSnackbar("Oops! max "+this.bottomGalleryMaxCount+" more ad images",true,"close");
      }else{
        this.uploadBottomGalleryPic(event);       
      }
    }    
  }
uploadTopGalleryPic(fileEvent:any){
  this.isUploading =true;
  this.showSnackbar("Please be patient! uploading top ads...",true,"okay");
  const uploadData = new FormData();
  for  (var i =  0; i <  this.galleryTopFiles.length; i++)  {  
    uploadData.append('adImages', this.galleryTopFiles[i]);
  } 
  this.adService.uploadAdPicByAdType(uploadData,"HOME_BANNER").subscribe((event: HttpEvent<any>) => {
    switch (event.type) {
      case HttpEventType.Sent:
        this.galleryTopProgress = 1;
        break;
      case HttpEventType.ResponseHeader:
        break;
      case HttpEventType.UploadProgress:
        this.galleryTopProgress = Math.round(event.loaded / event.total * 100);
        break;
      case HttpEventType.Response:
        this.isUploading = false;
        if(event.body["success"]){
          this.showSnackbar("Uploaded top ads",true,"close");   
          this.galleryTopFiles = [];
          this.getTopGalleryImages();  
        }else{
          this.showSnackbar("Server error",true,"close");
        }
        setTimeout(() => {
          this.galleryTopProgress = 0;
        }, 1500);
        break;
      default:
        this.galleryTopProgress = 0;
        return `Unhandled event: ${event.type}`;
    }
  },error=>{
      console.log(error);
      this.galleryTopProgress = 0;
      this.isUploading = false;
      this.showSnackbar("Connection Error!",true,"close");
  });
}
uploadBottomGalleryPic(fileEvent:any){
  this.isUploading =true;
  this.showSnackbar("Please be patient! uploading bottom ads...",true,"okay");
  const uploadData = new FormData();
  for  (var i =  0; i <  this.galleryBottomFiles.length; i++)  {  
    uploadData.append('adImages', this.galleryBottomFiles[i]);
  } 
  this.adService.uploadAdPicByAdType(uploadData,"HOME_BANNER_BOTTOM").subscribe((event: HttpEvent<any>) => {
    switch (event.type) {
      case HttpEventType.Sent:
        this.galleryBottomProgress = 1;
        break;
      case HttpEventType.ResponseHeader:
        break;
      case HttpEventType.UploadProgress:
        this.galleryBottomProgress = Math.round(event.loaded / event.total * 100);
        break;
      case HttpEventType.Response:
        this.isUploading = false;
        if(event.body["success"]){
          this.showSnackbar("Uploaded bottom ads",true,"close");   
          this.galleryBottomFiles = [];
          this.getBottomGalleryImages();  
        }else{
          this.showSnackbar("Server error",true,"close");
        }
        setTimeout(() => {
          this.galleryBottomProgress = 0;
        }, 1500);
        break;
      default:
        this.galleryBottomProgress = 0;
        return `Unhandled event: ${event.type}`;
    }
  },error=>{
      console.log(error);
      this.galleryBottomProgress = 0;
      this.isUploading = false;
      this.showSnackbar("Connection Error!",true,"close");
  });
}
deleteGalleryImage(id:string,isTop:boolean){
  this.showSnackbar("Deleting Ad...",false,"");
  if(isTop){
    this.isGettingTopGalleryDetails = true;
  }else{
    this.isGettingBottomGalleryDetails = true;
  }
  this.adService.deleteHomeAdImage(id).subscribe(res=>{
    if(res["success"]){
      this.showSnackbar("Deleted successfully!",true,"close");
      if(isTop){
        this.getTopGalleryImages();
      }else{
        this.getBottomGalleryImages();
      }
    }else{
      if(isTop){
        this.isGettingTopGalleryDetails = false;
      }else{
        this.isGettingBottomGalleryDetails = false;
      }
      this.showSnackbar("Server error on deleting!",true,"close");
    }
  },error=>{
    this.showSnackbar("Connection error!",true,"close");
  });
}
}
