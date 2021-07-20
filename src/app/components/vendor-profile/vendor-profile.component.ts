import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from 'src/app/services/agent.service';
import { CategoryService } from 'src/app/services/category.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.css']
})
export class VendorProfileComponent implements OnInit {
 //based on membership
  isAgent:boolean = false;
  galleryMaxCount:number = 10;
  vendorId:any;
  isGettingProfileDetails:boolean = true;
  isGettingServiceAndLocationDetails:boolean = true;
  isGettingGalleryDetails:boolean = false;
  isSavingDetails:boolean = false;
  isSavingServiceAndLocation:boolean = false;
  isUploading:boolean = false;
  isVerified:boolean;
  isEnabled:boolean;
  isToggling:boolean = true;
  isChanging:boolean = false;
  isVerifying:boolean = true;
  companyDetailsForm: FormGroup;
  categoryAndLocationsForm: FormGroup;
  changePasswordForm: FormGroup;
  agent:any = {};
  categoryName:any = "Loading...";
  categoryId:any;

  profilePreview = [];
  logoPreview = [];
  existingGallery = [];
  brochureFilename:string = "";

  profileProgress:number = 0;
  logoProgress:number = 0;
  galleryProgress:number = 0;
  brochureProgress:number = 0;

  galleryFiles:File[] = [];
  profileFile:File=null;
  logoFile:File=null;
  brochureFile:File=null;

  locations:any = [];
  preferredLocations:any = [];
  subCategories:any = [];
  vendorSubCategories:any = [];

  latitude = 10.0088142;
  longitude = 76.3156612;

  constructor(
    private route:ActivatedRoute,
    private vendorService:VendorService,
    private categoryService:CategoryService,
    private snackBar:MatSnackBar,
    private agentService:AgentService,
    private router:Router,
    private fb:FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.vendorId= params.get('vendorId');
    });
    this.companyDetailsForm = this.fb.group({
      companyName: ['', Validators.required],
      longitude:['',Validators.required],
      latitude:['',Validators.required],
      gstNumber:[''],
      address:['',Validators.required],
      whatsappNum:['',Validators.pattern("^[0-9]{10}$")],
      fbLink:[''],
      youtubeLink:[''],
      websiteLink:[''],
      location:['none',Validators.required],
      about:['',Validators.required]
    }); 
    this.categoryAndLocationsForm = this.fb.group({
      subCategories:['',Validators.required],
      preferredLocations:['',Validators.required]
    });
    this.changePasswordForm = this.fb.group({
      password: ['', Validators.required],
      repassword:['',Validators.required]
    });
    this.getAllLocation();
    this.getAgentDetails();
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  getAgentDetails(){
    this.agentService.getAgentDetailsByVendorId(this.vendorId).subscribe(res=>{
      if(res["success"]){
        this.isAgent = res["data"]?true:false;
        this.agent = res["data"];
      }else{
        this.isAgent = false;
        this.showSnackbar("Agent detail error!",true,"close");
      }
    },error=>{
      this.isAgent = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  getAllLocation(){
    this.vendorService.getAllLocations().subscribe(res=>{
      if(res["success"]){
        this.locations = res["data"];
        this.getCompanyDetails();
      }else{
        this.isGettingProfileDetails = false;
        this.showSnackbar("Vendor detail error!",true,"close");
      }
    },error=>{
      this.isGettingProfileDetails = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  getCompanyDetails(){
    this.vendorService.getVendorProfileDetails(this.vendorId).subscribe(res=>{
      this.isGettingProfileDetails = false;
      if(res["success"]){       
        this.isToggling = false;
        this.isVerifying = false;
        this.isEnabled = res["data"]["enabled"];
        this.isVerified = res["data"]["verified"];
        this.setExistingImages(res["data"]);
        this.changeCoordinates(parseFloat(res["data"]["latitude"]),parseFloat(res["data"]["longitude"]));
        if((res["data"]["whatsappNum"])&&(res["data"]["whatsappNum"]!="")){
          res["data"]["whatsappNum"] = res["data"]["whatsappNum"].slice(-10);
        }        
        this.companyDetailsForm.patchValue(res["data"]);
        this.getVendorServiceDetails();
      }else{
       this.showSnackbar("Vendor details not found!",true,"close");
      }
   },error=>{
     this.isGettingProfileDetails = false;
     this.showSnackbar("Connection error!",true,"close");
   });
  }
  getVendorServiceDetails(){
    this.categoryService.getSubCategoriesByVendorId(this.vendorId).subscribe(res=>{
      if(res["success"]){
        this.vendorSubCategories = res["data"];
        this.categoryName = [...new Set(this.vendorSubCategories.map(item => item.categoryName))][0];
        this.categoryId = [...new Set(this.vendorSubCategories.map(item => item.categoryId))][0];
        this.getAllSubCategories();
      }else{
        this.isGettingServiceAndLocationDetails = false;
        this.showSnackbar("Vendor service details not found!",true,"close");
      }
    },error=>{
      this.isGettingServiceAndLocationDetails = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  getAllSubCategories(){
    this.categoryService.getSubCategoriesById(this.categoryId).subscribe(res=>{
      if(res["success"]){
        this.subCategories = res["data"];
        this.categoryAndLocationsForm.get("subCategories").setValue([...new Set(this.vendorSubCategories.map(item => item.subCategoryName))]);
        this.getPreferredLocations();
      }else{
        this.isGettingServiceAndLocationDetails = false;
        this.showSnackbar("Services not found!",true,"close");
      }
    },error=>{
      this.isGettingServiceAndLocationDetails = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  getPreferredLocations(){
    this.vendorService.getPreferredLocations(this.vendorId).subscribe(res=>{
      if(res["success"]){
        this.preferredLocations = res["data"];
        this.categoryAndLocationsForm.get("preferredLocations").setValue(this.preferredLocations);
        this.isGettingServiceAndLocationDetails = false;
      }else{
        this.isGettingServiceAndLocationDetails = false;
        this.showSnackbar("Preferred locations not found!",true,"close");
      }
    },error=>{
      this.isGettingServiceAndLocationDetails = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  setExistingImages(data:any){
    this.getGalleryImages();    
    if((data["profilePic"])&&(data["profilePic"])!=""){
      this.profilePreview.push("https://mynestonline.com/collection/images/company-profile/"+data["profilePic"]);  
    }
    if((data["logo"])&&(data["logo"])!=""){
      this.logoPreview.push("https://mynestonline.com/collection/images/company-logo/"+data["logo"]);  
    }
    if((data["brochureFilePath"])&&(data["brochureFilePath"])!=""){
      this.brochureFilename= data["brochureFilePath"];  
    }
  }
  getGalleryImages(){
    this.existingGallery = [];
    this.isGettingGalleryDetails = true;
    this.vendorService.getGalleryImages(this.vendorId).subscribe(res=>{
      this.isGettingGalleryDetails = false;
       if(res["success"]){
          this.galleryMaxCount = 10 - res["data"].length;
          this.existingGallery = res["data"];
       }
    },error=>{
      this.isGettingGalleryDetails = false;
      this.showSnackbar("Gallery connection error!",true,"close");
    })
  }
  setLocation(event:any){
    this.changeCoordinates(event.coords.lat,event.coords.lng);
  }
  markerDragEnd(event:any){
    this.changeCoordinates(event.coords.lat,event.coords.lng);
  }
  changeCoordinates(lat:any,lng:any){
    this.latitude = lat;
    this.longitude = lng;
    this.companyDetailsForm.get("latitude").setValue(lat);
    this.companyDetailsForm.get("longitude").setValue(lng);
  }
  setLat(){
    this.latitude = parseFloat(this.companyDetailsForm.get("latitude").value);
  }
  setLng(){
    this.longitude = parseFloat(this.companyDetailsForm.get("longitude").value);
  }
  companyFormSubmit(){
    if(!this.companyDetailsForm.get("whatsappNum").hasError("pattern")){
    if(this.companyDetailsForm.valid){
      if(this.companyDetailsForm.get("location").value!="none"){
        this.showSnackbar("Saving details...",false,"");
        this.isSavingDetails = true;
        let formData = this.companyDetailsForm.value;
        formData["vendorId"]=this.vendorId;
        formData["whatsappNum"]="91"+formData["whatsappNum"];
        this.vendorService.editVendorCompanyDetails(formData).subscribe(res=>{
          this.isSavingDetails = false;
          if(res["success"]){
            this.showSnackbar("Profile details updated!",true,"close");
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
        },error=>{
          this.isSavingDetails = false;
          this.showSnackbar("Connection error!",true,"close");
        });
      }else{
        this.showSnackbar("Please select company location",true,"okay");
      }      
      }else{
        this.showSnackbar("Please fill all required fields",true,"okay");
      } 
    }else{
      this.showSnackbar("Invalid watsapp number",true,"close");
    }         
  }
  categoryAndLocationFormSubmit(){
    if(this.categoryAndLocationsForm.valid){
      this.showSnackbar("Saving details...",false,"");
      this.isSavingServiceAndLocation = true;      
      this.editServices();
    }else{
      this.showSnackbar("Please fill all required fields",true,"okay");
    } 
  }
  editServices(){
    let formData = {};
    formData["vendorId"] = this.vendorId;
    formData["categoryId"] = this.categoryId;
    formData["subCategories"] = this.categoryAndLocationsForm.get("subCategories").value;
    this.vendorService.editServices(formData).subscribe(res=>{
      if(res["success"]){
        this.editPreferredLocations();
      }else{
        this.isSavingServiceAndLocation = false;
        this.showSnackbar("Server error for services!",true,"close");
      }
    },error=>{
      this.isSavingServiceAndLocation = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  editPreferredLocations(){
    let formData = {};
    formData["locations"] = this.categoryAndLocationsForm.get("preferredLocations").value;
    formData["vendorId"] = this.vendorId;
    this.vendorService.editPreferredLocations(formData).subscribe(res=>{
      this.isSavingServiceAndLocation = false;
      if(res["success"]){
        this.showSnackbar("Updated successfully!",true,"close");
      }else{
        this.showSnackbar("Server error for locations!",true,"close");
      }
    },error=>{
      this.isSavingServiceAndLocation = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }

  onProfileSelect(event:any){
    this.profileFile = event.target.files[0];
    if(this.profileFile){  
      this.uploadProfilePic(event);
    }
  }
  onLogoSelect(event:any){
    this.logoFile = event.target.files[0];
    if(this.logoFile){  
      this.uploadLogo(event);
    }    
  }
  onBrochureSelect(event:any){
    this.brochureFile = event.target.files[0];
    if(this.brochureFile){  
      this.uploadBrochure(event);
    }     
  }
  onGallerySelect(event:any){
    this.galleryFiles = event.target.files;
    if(this.galleryFiles.length){
      if(this.galleryFiles.length > this.galleryMaxCount){
        this.showSnackbar("Oops! max "+this.galleryMaxCount+" more gallery images",true,"close");
      }else{
        this.uploadGalleryPic(event);       
      }
    }    
  }
  uploadProfilePic(fileEvent:any){
    this.isUploading =true;
    this.showSnackbar("Please be patient! uploading profile pic...",true,"okay");
    const uploadData = new FormData();
    uploadData.append('profilePic', this.profileFile);
    this.vendorService.uploadProfilePic(uploadData,this.vendorId).subscribe(
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
uploadLogo(fileEvent:any){
  this.isUploading =true;
  this.showSnackbar("Please be patient! uploading logo...",true,"okay");
  const uploadData = new FormData();
  uploadData.append('logo', this.logoFile);
  this.vendorService.uploadLogoPic(uploadData,this.vendorId).subscribe((event: HttpEvent<any>) => {
    switch (event.type) {
      case HttpEventType.Sent:
        this.logoPreview = [];
        this.logoProgress = 1;
        break;
      case HttpEventType.ResponseHeader:
        break;
      case HttpEventType.UploadProgress:
        this.logoProgress = Math.round(event.loaded / event.total * 100);
        break;
      case HttpEventType.Response:
        this.isUploading = false;
        if(event.body["success"]){
          this.showSnackbar("Uploaded logo",true,"close");            
          this.logoFile = null;
          var reader = new FileReader();   
          reader.onload = (event:any) => {
            this.logoPreview.push(event.target.result);  
          } 
          reader.readAsDataURL(fileEvent.target.files[0]);
        }else{
          this.showSnackbar("Server error",true,"close");
        }
        setTimeout(() => {
          this.logoProgress = 0;
        }, 1500);
        break;
      default:
        this.logoProgress = 0;
        return `Unhandled event: ${event.type}`;
    }
  },error=>{
      this.logoProgress = 0;
      this.isUploading = false;
      this.showSnackbar("Connection Error!",true,"close");
  });
}
uploadBrochure(fileEvent:any){
  this.isUploading =true;
  this.showSnackbar("Please be patient! uploading brochure...",true,"okay");
  const uploadData = new FormData();
  uploadData.append('brochure', this.brochureFile);
  this.vendorService.uploadBrochure(uploadData,this.vendorId).subscribe((event: HttpEvent<any>) => {
    switch (event.type) {
      case HttpEventType.Sent:
        this.brochureFilename = "";
        this.brochureProgress = 1;
        break;
      case HttpEventType.ResponseHeader:
        break;
      case HttpEventType.UploadProgress:
        this.brochureProgress = Math.round(event.loaded / event.total * 100);
        break;
      case HttpEventType.Response:
        this.isUploading = false;
        if(event.body["success"]){
          this.showSnackbar("Uploaded brochure",true,"close");            
          this.brochureFilename = this.brochureFile.name;    
        }else{
          this.showSnackbar("Server error",true,"close");
        }
        setTimeout(() => {
          this.brochureProgress = 0;
        }, 1500);
        break;
      default:
        this.brochureProgress = 0;
        return `Unhandled event: ${event.type}`;
    }
  },error=>{
      this.brochureProgress = 0;
      this.isUploading = false;
      this.showSnackbar("Connection Error!",true,"close");
  });
}
uploadGalleryPic(fileEvent:any){
  this.isUploading =true;
  this.showSnackbar("Please be patient! uploading gallery pics...",true,"okay");
  const uploadData = new FormData();
  for  (var i =  0; i <  this.galleryFiles.length; i++)  {  
    uploadData.append('images', this.galleryFiles[i]);
  } 
  this.vendorService.uploadGalleryPic(uploadData,this.vendorId).subscribe((event: HttpEvent<any>) => {
    switch (event.type) {
      case HttpEventType.Sent:
        this.galleryProgress = 1;
        break;
      case HttpEventType.ResponseHeader:
        break;
      case HttpEventType.UploadProgress:
        this.galleryProgress = Math.round(event.loaded / event.total * 100);
        break;
      case HttpEventType.Response:
        this.isUploading = false;
        if(event.body["success"]){
          this.showSnackbar("Uploaded gallery pics",true,"close");   
          this.galleryFiles = [];
          this.getGalleryImages();  
        }else{
          this.showSnackbar("Server error",true,"close");
        }
        setTimeout(() => {
          this.galleryProgress = 0;
        }, 1500);
        break;
      default:
        this.galleryProgress = 0;
        return `Unhandled event: ${event.type}`;
    }
  },error=>{
      this.galleryProgress = 0;
      this.isUploading = false;
      this.showSnackbar("Connection Error!",true,"close");
  });
}
deleteGalleryImage(url:string){
  this.showSnackbar("Deleting image...",false,"");
  this.isGettingGalleryDetails = true;
  this.vendorService.deleteGalleryImage(this.vendorId,url).subscribe(res=>{
    if(res["success"]){
      this.showSnackbar("Deleted successfully!",true,"close");
      this.getGalleryImages();
    }else{
      this.isGettingGalleryDetails = false;
      this.showSnackbar("Server error on deleting!",true,"close");
    }
  },error=>{
    this.showSnackbar("Connection error!",true,"close");
  });
}
changeActiveStatus(event:any){
  this.isToggling = true;
  this.showSnackbar(this.isEnabled?"Deactivating...":"Activating...",false,"");
  let paramData = {};
  paramData["id"] = this.vendorId;
  paramData["enabled"] = !this.isEnabled;
  this.vendorService.toggleActiveStatus(paramData).subscribe(res=>{
    this.isToggling =false;
    if(res["success"]){
      this.isEnabled = !this.isEnabled;
      this.showSnackbar(this.isEnabled?"Deactivated successfully!":"Activated successfully!",true,"close");        
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
  verifyVendor(){
    if(!this.isVerified){
      this.isVerifying = true;
      this.vendorService.verifyVendor(this.vendorId).subscribe(res=>{
          this.isVerifying =false;
          if(res["success"]){
            this.isVerified = !this.isVerified;
            this.showSnackbar("Verified successfully!",true,"close");        
          }else{
            this.showSnackbar("Verify vendor server error!",true,"close");
          }
      },error=>{
        this.isToggling = false;
        this.showSnackbar("Verify vendor connection error!",true,"close");
      });
    }else{
      this.showSnackbar("Vendor is already verified!",true,"okay");
    }
  }
  changePassword(){
    if(this.changePasswordForm.valid){
      if(this.changePasswordForm.get("password").value==this.changePasswordForm.get("repassword").value){
        this.showSnackbar("Changing password...",false,"");
        this.isChanging = true;
        let formData = {};
        formData["newPassword"]=this.changePasswordForm.get("password").value;
        formData["userId"]=this.vendorId;
        this.vendorService.changePassword(formData).subscribe(res=>{
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
  goToAgent(){
    this.router.navigate(["agents-vendors/"+this.agent.agentId+"/"+this.agent.location]);
  }
}
