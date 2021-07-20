import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AdvertisementService } from 'src/app/services/advertisement.service';

@Component({
  selector: 'app-change-base-price',
  templateUrl: './change-base-price.component.html',
  styleUrls: ['./change-base-price.component.css']
})
export class ChangeBasePriceComponent implements OnInit {

  isChanging:boolean = false;
  iconFile:File=null;
  basePriceForm:FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ChangeBasePriceComponent>,
    private snackBar:MatSnackBar,
    private fb: FormBuilder,
    private advertisementService:AdvertisementService
  ) { }

  ngOnInit(): void {
    this.basePriceForm = this.fb.group({
      adBasePrice: ['', [Validators.required,Validators.pattern('^[1-9][0-9]*$')]]
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
  changeAll(){
      if(this.basePriceForm.valid){
        this.isChanging = true;
        this.advertisementService.changeAllBasePrice(this.basePriceForm.get("adBasePrice").value).subscribe(res=>{
           this.isChanging = false;
           if(res["success"]){
             this.dialogRef.close(true);
           }else{
             this.showSnackbar("Server error!",true,"close");
           }
        },error=>{  
         this.isChanging = false;       
         this.showSnackbar("Connection error!",true,"close");
        });
      }else{
        this.showSnackbar("Please fill required data's",true,"close");
      }   
  }  

}
