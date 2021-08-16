import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { GetAdLinkComponent } from 'src/app/dialogs/get-ad-link/get-ad-link.component';
import { AdvertisementService } from 'src/app/services/advertisement.service';

@Component({
  selector: 'app-home-ads',
  templateUrl: './home-ads.component.html',
  styleUrls: ['./home-ads.component.css']
})
export class HomeAdsComponent implements OnInit {

  bottomGalleryMaxCount:number = 4;
  topGalleryMaxCount:number = 4;
  bottomGalleryMobMaxCount:number = 4;
  topGalleryMobMaxCount:number = 4;
  
  galleryTopInfo = [];
  galleryTopMobInfo = [];
  galleryBottomInfo = [];
  galleryBottomMobInfo = [];

  isGettingTopGalleryDetails:boolean = false;
  isGettingBottomGalleryDetails:boolean = false;
  isGettingTopGalleryMobDetails:boolean = false;
  isGettingBottomGalleryMobDetails:boolean = false;

  isUploading:boolean = false;

  existingTopGallery = [];
  existingBottomGallery = [];
  existingTopMobGallery = [];
  existingBottomMobGallery = [];

  galleryTopProgress:number = 0;
  galleryBottomProgress:number = 0;
  galleryTopMobProgress:number = 0;
  galleryBottomMobProgress:number = 0;

  galleryTopFiles:File[] = [];
  galleryBottomFiles:File[] = [];
  galleryTopMobFiles:File[] = [];
  galleryBottomMobFiles:File[] = [];
  link:any = null;

  constructor(
    private snackBar:MatSnackBar,
    private adService:AdvertisementService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getTopGalleryImages();
    this.getBottomGalleryImages();
    this.getTopGalleryMobImages();
    this.getBottomGalleryMobImages();
  }
  //greatest common divisor for aspect ratio(divide width or length by return gcd for aspect ratio)
  gcd (a:number, b:number) {
    return (b == 0) ? a : this.gcd (b, a%b);
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
    this.adService.getHomeGalleryImagesByType("HOME_BANNER",false).subscribe(res=>{
      this.isGettingTopGalleryDetails = false;
       if(res["success"]){
          this.topGalleryMaxCount = 4 - res["data"].length;
          this.existingTopGallery = res["data"];
       }else{
        this.topGalleryMaxCount = 4;
       }
    },error=>{
      this.isGettingTopGalleryDetails = false;
      this.showSnackbar("Top ads connection error!",true,"close");
    })
  }
  getBottomGalleryImages(){
    this.existingBottomGallery = [];
    this.isGettingBottomGalleryDetails = true;
    this.adService.getHomeGalleryImagesByType("HOME_BANNER_BOTTOM",false).subscribe(res=>{
      this.isGettingBottomGalleryDetails = false;
       if(res["success"]){
          this.bottomGalleryMaxCount = 4 - res["data"].length;
          this.existingBottomGallery = res["data"];
       }else{
        this.bottomGalleryMaxCount = 4;
       }
    },error=>{
      this.isGettingBottomGalleryDetails = false;
      this.showSnackbar("Top ads connection error!",true,"close");
    })
  }
  getTopGalleryMobImages(){
    this.existingTopMobGallery = [];
    this.isGettingTopGalleryMobDetails = true;
    this.adService.getHomeGalleryImagesByType("HOME_BANNER",true).subscribe(res=>{
      this.isGettingTopGalleryMobDetails = false;
       if(res["success"]){
          this.topGalleryMobMaxCount = 4 - res["data"].length;
          this.existingTopMobGallery = res["data"];
       }else{
        this.topGalleryMobMaxCount = 4;
       }
    },error=>{
      this.isGettingTopGalleryMobDetails = false;
      this.showSnackbar("Top ads connection error!",true,"close");
    })
  }
  getBottomGalleryMobImages(){
    this.existingBottomMobGallery = [];
    this.isGettingBottomGalleryMobDetails = true;
    this.adService.getHomeGalleryImagesByType("HOME_BANNER_BOTTOM",true).subscribe(res=>{
      this.isGettingBottomGalleryMobDetails = false;
       if(res["success"]){
          this.bottomGalleryMobMaxCount = 4 - res["data"].length;
          this.existingBottomMobGallery = res["data"];
       }else{
         this.bottomGalleryMobMaxCount = 4;
       }
    },error=>{
      this.isGettingBottomGalleryMobDetails = false;
      this.showSnackbar("Top ads connection error!",true,"close");
    })
  }  
  checkDimensionsTop(file:File,index:number){
    var reader = new FileReader();   
    reader.onload = (event:any) => {  
      var img = new Image();    
      img.onload = () => {
        if((img.width/this.gcd(img.width,img.height)==128)&&(img.height/this.gcd(img.width,img.height)==25)){
            this.galleryTopFiles.push(file);
          }else{
            this.galleryTopInfo.push("File dimension of "+file.name+" is incorrect");
            setTimeout(()=>{
              if(this.galleryTopInfo.length){
                this.galleryTopInfo.shift();
              }
            },5000+(index*1000));
          }
      };
      img.src = event.target.result;
    } 
    reader.readAsDataURL(file);
  }
  checkDimensionsBottom(file:File,index:number){
    var reader = new FileReader();   
    reader.onload = (event:any) => {  
      var img = new Image();    
      img.onload = () => {
        if((img.width/this.gcd(img.width,img.height)==128)&&(img.height/this.gcd(img.width,img.height)==25)){
            this.galleryBottomFiles.push(file);
          }else{
            this.galleryBottomInfo.push("File dimension of "+file.name+" is incorrect");
            setTimeout(()=>{
              if(this.galleryBottomInfo.length){
                this.galleryBottomInfo.shift();
              }
            },5000+(index*1000));
          }
      };
      img.src = event.target.result;
    } 
    reader.readAsDataURL(file);
  }
  checkDimensionsTopMob(file:File,index:number){
    var reader = new FileReader();   
    reader.onload = (event:any) => {  
      var img = new Image();    
      img.onload = () => {
        if((img.width/this.gcd(img.width,img.height)==2)&&(img.height/this.gcd(img.width,img.height)==1)){
            this.galleryTopMobFiles.push(file);
          }else{
            this.galleryTopMobInfo.push("File dimension of "+file.name+" is incorrect");
            setTimeout(()=>{
              if(this.galleryTopMobInfo.length){
                this.galleryTopMobInfo.shift();
              }
            },5000+(index*1000));
          }
      };
      img.src = event.target.result;
    } 
    reader.readAsDataURL(file);
  }
  checkDimensionsBottomMob(file:File,index:number){
    var reader = new FileReader();   
    reader.onload = (event:any) => {  
      var img = new Image();    
      img.onload = () => {
        if((img.width/this.gcd(img.width,img.height)==2)&&(img.height/this.gcd(img.width,img.height)==1)){
            this.galleryBottomMobFiles.push(file);
          }else{
            this.galleryBottomMobInfo.push("File dimension of "+file.name+" is incorrect");
            setTimeout(()=>{
              if(this.galleryBottomMobInfo.length){
                this.galleryBottomMobInfo.shift();
              }
            },5000+(index*1000));
          }
      };
      img.src = event.target.result;
    } 
    reader.readAsDataURL(file);
  }
  onTopGallerySelect(event:any){
    var _size:any,name:string,file:File;
      if(event.target.files.length > this.topGalleryMaxCount){
        this.showSnackbar("Oops! max "+this.topGalleryMaxCount+" more ad images",true,"close");
      }else{
        for(var j = 0; j<event.target.files.length;j++){
          _size = event.target.files[j].size;
          name = event.target.files[j].name; 
          file = event.target.files[j]; 
          var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),i=0;
              while(_size>900)
              {
                _size/=1024;
                i++;
              }
          if((((Math.round(_size*100)/100)>5)&&(i==2))||(i==3)){
            this.galleryTopInfo.push("File size of "+name+" was larger than 5 MB");
            setTimeout(()=>{
              if(this.galleryTopInfo.length){
                this.galleryTopInfo.shift();
              }
            },5000+(j*1000));
          }else{          
            this.checkDimensionsTop(file,j);
          } 
        }
        setTimeout(()=>{
          if(this.galleryTopFiles.length){
            const dialogRef = this.dialog.open(GetAdLinkComponent,{
              disableClose:true         
            });
        
            dialogRef.afterClosed().subscribe(result => {          
              this.link = result;
              this.uploadTopGalleryPic(event);       
            });
          }         
        },800);        
      }      
  }
  onBottomGallerySelect(event:any){
    var _size:any,name:string,file:File;
    if(this.galleryBottomFiles.length > this.bottomGalleryMaxCount){
      this.showSnackbar("Oops! max "+this.bottomGalleryMaxCount+" more ad images",true,"close");
    }else{
      for(var j = 0; j<event.target.files.length;j++){
        _size = event.target.files[j].size;
        name = event.target.files[j].name; 
        file = event.target.files[j]; 
        var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),i=0;
            while(_size>900)
            {
              _size/=1024;
              i++;
            }
        if((((Math.round(_size*100)/100)>5)&&(i==2))||(i==3)){
          this.galleryBottomInfo.push("File size of "+name+" was larger than 5 MB");
          setTimeout(()=>{
            if(this.galleryBottomInfo.length){
              this.galleryBottomInfo.shift();
            }
          },5000+(j*1000));
        }else{          
          this.checkDimensionsBottom(file,j);
        } 
      }
      setTimeout(()=>{
        if(this.galleryBottomFiles.length){
          const dialogRef = this.dialog.open(GetAdLinkComponent,{
            disableClose:true         
          });
      
          dialogRef.afterClosed().subscribe(result => {          
            this.link = result;
            this.uploadBottomGalleryPic(event);       
          });
        }
      },800);        
    }      
  }
  onTopGalleryMobSelect(event:any){
    var _size:any,name:string,file:File;
    if(this.galleryTopMobFiles.length > this.topGalleryMobMaxCount){
      this.showSnackbar("Oops! max "+this.topGalleryMobMaxCount+" more ad images",true,"close");
    }else{
        for(var j = 0; j<event.target.files.length;j++){
          _size = event.target.files[j].size;
          name = event.target.files[j].name; 
          file = event.target.files[j]; 
          var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),i=0;
              while(_size>900)
              {
                _size/=1024;
                i++;
              }
          if((((Math.round(_size*100)/100)>5)&&(i==2))||(i==3)){
            this.galleryTopMobInfo.push("File size of "+name+" was larger than 5 MB");
            setTimeout(()=>{
              if(this.galleryTopMobInfo.length){
                this.galleryTopMobInfo.shift();
              }
            },5000+(j*1000));
          }else{          
            this.checkDimensionsTopMob(file,j);
          } 
        }
        setTimeout(()=>{
          if(this.galleryTopMobFiles.length){
          const dialogRef = this.dialog.open(GetAdLinkComponent,{
            disableClose:true         
          });
      
          dialogRef.afterClosed().subscribe(result => {          
            this.link = result;
            this.uploadTopGalleryMobPic(event);       
          });
        }
        },800);        
      }      
  } 
  onBottomGalleryMobSelect(event:any){
    var _size:any,name:string,file:File;
    if(this.galleryBottomMobFiles.length > this.bottomGalleryMobMaxCount){
      this.showSnackbar("Oops! max "+this.bottomGalleryMobMaxCount+" more ad images",true,"close");
    }else{
        for(var j = 0; j<event.target.files.length;j++){
          _size = event.target.files[j].size;
          name = event.target.files[j].name; 
          file = event.target.files[j]; 
          var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),i=0;
              while(_size>900)
              {
                _size/=1024;
                i++;
              }
          if((((Math.round(_size*100)/100)>5)&&(i==2))||(i==3)){
            this.galleryBottomMobInfo.push("File size of "+name+" was larger than 5 MB");
            setTimeout(()=>{
              if(this.galleryBottomMobInfo.length){
                this.galleryBottomMobInfo.shift();
              }
            },5000+(j*1000));
          }else{          
            this.checkDimensionsBottomMob(file,j);
          } 
        }
          setTimeout(()=>{
            if(this.galleryBottomMobFiles.length){
            const dialogRef = this.dialog.open(GetAdLinkComponent,{
              disableClose:true         
            });
        
            dialogRef.afterClosed().subscribe(result => {          
              this.link = result;
              this.uploadBottomGalleryMobPic(event);
            });  
          }
        },800);        
      }      
  } 
 
uploadTopGalleryPic(fileEvent:any){
  this.isUploading =true;
  this.showSnackbar("Please be patient! uploading top ads...",true,"okay");
  const uploadData = new FormData();
  for  (var i =  0; i <  this.galleryTopFiles.length; i++)  {  
    uploadData.append('adImages', this.galleryTopFiles[i]);
  } 
  this.adService.uploadAdPicByAdType(uploadData,"HOME_BANNER",this.link,false).subscribe((event: HttpEvent<any>) => {
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
          this.link = null;
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
  this.adService.uploadAdPicByAdType(uploadData,"HOME_BANNER_BOTTOM",this.link,false).subscribe((event: HttpEvent<any>) => {
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
          this.link = null;
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
uploadTopGalleryMobPic(fileEvent:any){
  this.isUploading =true;
  this.showSnackbar("Please be patient! uploading top ads for mobile...",true,"okay");
  const uploadData = new FormData();
  for  (var i =  0; i <  this.galleryTopMobFiles.length; i++)  {  
    uploadData.append('adImages', this.galleryTopMobFiles[i]);
  } 
  this.adService.uploadAdPicByAdType(uploadData,"HOME_BANNER",this.link,true).subscribe((event: HttpEvent<any>) => {
    switch (event.type) {
      case HttpEventType.Sent:
        this.galleryTopMobProgress = 1;
        break;
      case HttpEventType.ResponseHeader:
        break;
      case HttpEventType.UploadProgress:
        this.galleryTopMobProgress = Math.round(event.loaded / event.total * 100);
        break;
      case HttpEventType.Response:
        this.isUploading = false;
        if(event.body["success"]){
          this.showSnackbar("Uploaded top ads for mobile",true,"close");   
          this.galleryTopMobFiles = [];
          this.link = null;
          this.getTopGalleryMobImages();  
        }else{
          this.showSnackbar("Server error",true,"close");
        }
        setTimeout(() => {
          this.galleryTopMobProgress = 0;
        }, 1500);
        break;
      default:
        this.galleryTopMobProgress = 0;
        return `Unhandled event: ${event.type}`;
    }
  },error=>{
      console.log(error);
      this.galleryTopMobProgress = 0;
      this.isUploading = false;
      this.showSnackbar("Connection Error!",true,"close");
  });
}
uploadBottomGalleryMobPic(fileEvent:any){
  this.isUploading =true;
  this.showSnackbar("Please be patient! uploading bottom ads for mobile...",true,"okay");
  const uploadData = new FormData();
  for  (var i =  0; i <  this.galleryBottomMobFiles.length; i++)  {  
    uploadData.append('adImages', this.galleryBottomMobFiles[i]);
  } 
  this.adService.uploadAdPicByAdType(uploadData,"HOME_BANNER_BOTTOM",this.link,true).subscribe((event: HttpEvent<any>) => {
    switch (event.type) {
      case HttpEventType.Sent:
        this.galleryBottomMobProgress = 1;
        break;
      case HttpEventType.ResponseHeader:
        break;
      case HttpEventType.UploadProgress:
        this.galleryBottomMobProgress = Math.round(event.loaded / event.total * 100);
        break;
      case HttpEventType.Response:
        this.isUploading = false;
        if(event.body["success"]){
          this.showSnackbar("Uploaded bottom ads for mobile",true,"close");   
          this.galleryBottomMobFiles = [];
          this.link = null;
          this.getBottomGalleryMobImages();  
        }else{
          this.showSnackbar("Server error",true,"close");
        }
        setTimeout(() => {
          this.galleryBottomMobProgress = 0;
        }, 1500);
        break;
      default:
        this.galleryBottomMobProgress = 0;
        return `Unhandled event: ${event.type}`;
    }
  },error=>{
      console.log(error);
      this.galleryBottomMobProgress = 0;
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
deleteGalleryMobImage(id:string,isTop:boolean){
  this.showSnackbar("Deleting Ad...",false,"");
  if(isTop){
    this.isGettingTopGalleryMobDetails = true;
  }else{
    this.isGettingBottomGalleryMobDetails = true;
  }
  this.adService.deleteHomeAdImage(id).subscribe(res=>{
    if(res["success"]){
      this.showSnackbar("Deleted successfully!",true,"close");
      if(isTop){
        this.getTopGalleryMobImages();
      }else{
        this.getBottomGalleryMobImages();
      }
    }else{
      if(isTop){
        this.isGettingTopGalleryMobDetails = false;
      }else{
        this.isGettingBottomGalleryMobDetails = false;
      }
      this.showSnackbar("Server error on deleting!",true,"close");
    }
  },error=>{
    this.showSnackbar("Connection error!",true,"close");
  });
}
}
