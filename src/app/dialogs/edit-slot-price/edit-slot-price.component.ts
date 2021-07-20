import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AdvertisementService } from 'src/app/services/advertisement.service';
import { startWith, map } from 'rxjs/operators';
@Component({
  selector: 'app-edit-slot-price',
  templateUrl: './edit-slot-price.component.html',
  styleUrls: ['./edit-slot-price.component.css']
})
export class EditSlotPriceComponent implements OnInit {
  isEditing:boolean = false;
  slotEditForm:FormGroup;
  totalAmount:number = 0;
  basePrice:number = 0;
  currentSlotPrice:number = 0;
  slotPrice:number = 0;
  constructor(
    public dialogRef: MatDialogRef<EditSlotPriceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar:MatSnackBar,
    private fb: FormBuilder,
    private adService:AdvertisementService
  ) { }

  ngOnInit(): void {
    this.totalAmount = Number(this.data.slots[0].price);
    this.basePrice = Number(this.data.slots[0].basePrice);
    this.currentSlotPrice = Number(this.data.slots[0].slotPrice);
    this.slotPrice = this.currentSlotPrice;
    this.slotEditForm = this.fb.group({
      price:[this.currentSlotPrice,Validators.required]
    });
    this.slotEditForm.get("price").valueChanges.pipe(
      startWith(this.currentSlotPrice)
    ).subscribe(res=>{
      this.totalAmount = this.basePrice+Number(res);
      this.slotPrice = res;
      if(this.totalAmount<=0){
        this.showSnackbar("Total price can't be a negative value",true,"okay");
        this.slotEditForm.get("price").setValue(0);
      }
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
  
  editSlotPrice(){
    if(this.slotEditForm.valid){
      this.isEditing = true;
      this.showSnackbar("Please be patient! editing slot price...",false,"");
      let paramData = {}
      paramData["price"] = String(this.slotEditForm.get("price").value);
      paramData["slotIds"] = this.data.slots.map(obj=>{
        return obj.slotId;
      });
      this.adService.editSlotPrice(paramData).subscribe(res=>{
          this.isEditing = false;
          if(res["success"]){
            this.dialogRef.close(true);
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
      },error=>{  
        this.isEditing = false;       
        this.showSnackbar("Connection error!",true,"close");
      });
    }else{
      this.showSnackbar("Please fill all fields",true,"close");
    }
    
  }
}
