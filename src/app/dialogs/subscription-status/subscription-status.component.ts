import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-subscription-status',
  templateUrl: './subscription-status.component.html',
  styleUrls: ['./subscription-status.component.css']
})
export class SubscriptionStatusComponent implements OnInit {
  
  isGetting:boolean = true;
  plans:any[] = [];
  displayedColumns: string[] = ['subscriptionid','planname','status','startdate','enddate'];
  constructor(
    public dialogRef: MatDialogRef<SubscriptionStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar:MatSnackBar,
    private planService:SubscriptionService,
  ) { }

  ngOnInit(): void {
    this.getPlans();
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  } 
  getPlans(){
      this.planService.getPlansByVendorId(this.data.vendorId).subscribe(res=>{
          this.isGetting = false;
          if(res["success"]){
            this.plans = res["data"];
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
      },error=>{  
        this.isGetting = false;       
        this.showSnackbar("Connection error!",true,"close");
    });
  }

}
