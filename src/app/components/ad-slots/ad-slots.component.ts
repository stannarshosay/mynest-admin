import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { EditSlotPriceComponent } from 'src/app/dialogs/edit-slot-price/edit-slot-price.component';
import { AdvertisementService } from 'src/app/services/advertisement.service';
import { CategoryService } from 'src/app/services/category.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-ad-slots',
  templateUrl: './ad-slots.component.html',
  styleUrls: ['./ad-slots.component.css']
})
export class AdSlotsComponent implements OnInit {
  isLoadingSlots:boolean = false;
  isBooking:boolean = false;
  orderId:string;
  isLoadingCategoriesAndLocations:boolean = false;
  categories:any[] = [];
  locations:any[] = [];
  slots:any[] = [];
  selectedSlots:any[] = [];
  options:any = {};
  slotsForm: FormGroup;
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
      categoryId:['',Validators.required],
      district:['',Validators.required]
    });
    this.getCategoryAndLocations();
  }
  getCategoryAndLocations(){
    this.isLoadingCategoriesAndLocations = true;
    this.categoryService.getCategories().subscribe(res=>{
      if(res["success"]){
        this.categories = res["data"];
        this.slotsForm.get("categoryId").setValue(this.categories[0].categoryId);
        this.locationService.getAllLocations().subscribe(res=>{
          if(res["success"]){
            this.locations = res["data"];
            this.isLoadingCategoriesAndLocations = false;            
            this.slotsForm.get("categoryId").setValue(String(this.categories[0].categoryId));
            this.slotsForm.get("district").setValue(this.locations[0].district);
            this.loadSlots();
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

  loadSlots(){    
    this.isLoadingSlots = true;
    this.slots = [];
    let param = {};
    param = this.slotsForm.value;
    param["adType"] = "SERVICE_LISTING"; 
    this.adService.getAllSlots(param).subscribe(res=>{
      this.isLoadingSlots = false;
      if(res["success"]){
        this.slots = res["data"];
      }else{
        this.showSnackbar("Oops! No slots available",true,"close");
      }
    },error=>{
      this.isLoadingSlots = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }

  toggleSlot(event:any,slot:any){
    if(event.target.checked){
      if(this.selectedSlots.length){
        if(slot.price == this.selectedSlots[0].price){
          this.selectedSlots.push(slot);
        }else{
          event.target.checked = false;
          this.showSnackbar("Oops! slot with varying price selected, please edit this slot separately",true,"close");
        }
      }else{
        this.selectedSlots.push(slot);
      }
    }else{
     let index = this.selectedSlots.findIndex((obj)=>{
       return obj.slotId == slot.slotId;
     });
     this.selectedSlots.splice(index,1);
    }
 } 
  editSlotPrice(){
    const dialogRef = this.dialog.open(EditSlotPriceComponent,{
      data:{
        slots:this.selectedSlots
      },
      width:"400px"
    }); 

    dialogRef.afterClosed().subscribe(result => {
      if(result){        
        this.showSnackbar("Price edited successfully!",true,"close");
        this.loadSlots();
      }
    });     
  }


}
