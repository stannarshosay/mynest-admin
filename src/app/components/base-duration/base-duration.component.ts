import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ChangeBasePriceComponent } from 'src/app/dialogs/change-base-price/change-base-price.component';
import { ChangeDurationComponent } from 'src/app/dialogs/change-duration/change-duration.component';
import { AdvertisementService } from 'src/app/services/advertisement.service';
import { CategoryService } from 'src/app/services/category.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-base-duration',
  templateUrl: './base-duration.component.html',
  styleUrls: ['./base-duration.component.css']
})
export class BaseDurationComponent implements OnInit {
  isChangingBasePrice:boolean = false;
  isChangingDuration:boolean = false;
  isLoadingSlots:boolean = false;
  isLoadingCategoriesAndLocations:boolean = false;
  categories:any[] = [];
  locations:any[] = [];
  slotsForm: FormGroup;
  duration:FormControl = new FormControl('',Validators.pattern('^[1-9][0-9]*$'));  
  basePrice:FormControl = new FormControl('',Validators.pattern('^[1-9][0-9]*$'));
  constructor(
    private locationService:LocationService,
    private categoryService:CategoryService,
    private adService:AdvertisementService,
    private snackBar:MatSnackBar,
    private fb:FormBuilder,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {    
    this.slotsForm = this.fb.group({
      categoryId:[],
      location:[]
    });
    this.getCategoryAndLocations();
  }
  getCategoryAndLocations(){
    this.isLoadingCategoriesAndLocations = true;
    this.categoryService.getCategories().subscribe(res=>{
      if(res["success"]){
        this.categories = res["data"];
        this.locationService.getAllLocations().subscribe(res=>{
          if(res["success"]){
            this.locations = res["data"];
            this.isLoadingCategoriesAndLocations = false; 
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
        },error=>{
          this.showSnackbar("Connection error!",true,"close");
        });
      }else{
        this.showSnackbar("Server error!",true,"close");
      }
    },error=>{
      this.showSnackbar("Connection error!",true,"close");
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
  changeAll(isBasePriceChange:boolean){
    if(isBasePriceChange){
      const dialogRef = this.dialog.open(ChangeBasePriceComponent,{       
        width:"400px"
       }
      ); 

      dialogRef.afterClosed().subscribe(result => {
        if(result){        
          this.showSnackbar("Changed base price successfully!",true,"close");
        }
      });     
    }else{
      const dialogRef = this.dialog.open(ChangeDurationComponent,{       
          width:"400px"
        }
      ); 

      dialogRef.afterClosed().subscribe(result => {
        if(result){        
          this.showSnackbar("Changed duration successfully!",true,"close");
        }
      });   
    }
    
  }
  changeBasePrice(){
    let paramData = {};
    paramData["location"] = this.slotsForm.get("location").value;
    paramData["categoryId"] = this.slotsForm.get("categoryId").value;
    if(!paramData["location"]&&!paramData["categoryId"]){
      this.showSnackbar("Select a location or category or both!",true,"close");
      return;
    }
    if(!paramData["location"]){
      delete paramData["location"];
    }
    if(!paramData["categoryId"]){
      delete paramData["categoryId"];
    }
    if(this.basePrice.valid&&this.basePrice.value){
      this.isChangingBasePrice = true;
      paramData["basePrice"] = this.basePrice.value;
      this.basePrice.setValue('');
      this.adService.changeBasePrice(paramData).subscribe(res=>{
        this.isChangingBasePrice = false;
        if(res["success"]){
          this.showSnackbar("Changed base price successfully!",true,"close");
          this.basePrice.setValue('');
        }else{
          this.showSnackbar("Server error!",true,"close");
        }
      },error=>{
        this.isChangingBasePrice = false;
        this.showSnackbar("Connection error!",true,"close");
      });
    }else{
      this.showSnackbar("Please provide a valid base price!",true,"close");
    }
  }
  changeDuration(){
    let paramData = {};
    paramData["location"] = this.slotsForm.get("location").value;
    paramData["categoryId"] = this.slotsForm.get("categoryId").value;
    if(!paramData["location"]&&!paramData["categoryId"]){
      this.showSnackbar("Select a location or category or both!",true,"close");
      return;
    }
    if(!paramData["location"]){
      delete paramData["location"];
    }
    if(!paramData["categoryId"]){
      delete paramData["categoryId"];
    }
    if(this.duration.valid&&this.duration.value){
      this.isChangingDuration = true;
      paramData["duration"] = this.duration.value;
      this.duration.setValue('');    
      this.adService.changeDuration(paramData).subscribe(res=>{
        this.isChangingDuration = false;
        if(res["success"]){
          this.showSnackbar("Changed duration successfully!",true,"close");
          this.duration.setValue('');
        }else{
          this.showSnackbar("Server error!",true,"close");
        }
      },error=>{
        this.isChangingDuration = false;
        this.showSnackbar("Connection error!",true,"close");
      });
    }else{
      this.showSnackbar("Please provide a valid duration!",true,"close");
    }
  }
}
