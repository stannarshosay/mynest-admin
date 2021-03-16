import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditPlanComponent } from 'src/app/dialogs/edit-plan/edit-plan.component';
import { PlanService } from 'src/app/services/plan.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {

  showSpinner:boolean = false; 
  isToggling:boolean = false;
  packages:any = [];
  constructor(
    private planService:PlanService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog
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
    this.showSpinner = true;
    this.planService.getAllPackages().subscribe(res=>{
       this.showSpinner =false;
       if(res["success"]){
          this.packages = res["data"].filter(obj=>
           obj.membershipName != "Bronze"
          ).reverse();
       }else{
         this.showSnackbar("No Plan details found!",true,"close");
       }
    },error=>{
      this.showSpinner =false;
      this.showSnackbar("Connection Error!",true,"close");
    });
  }

  editPackage(plan:any){
    const dialogRef = this.dialog.open(EditPlanComponent,{
      data:{
        plan:plan
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){        
        this.getPlans();
      }
    });
  }
  changeActiveStatus(status:boolean,id:number,event:any){
    this.isToggling = true;
    this.showSnackbar("Toggling status...",false,"");
    let paramData = {};
    paramData["membershipId"] = id;
    paramData["active"] = !status;
    this.planService.togglePackageStatus(paramData).subscribe(res=>{
      this.isToggling = false;
      if(res["success"]){
        this.showSnackbar((status?"Plan deactivated":"Plan activated")+" successfully",true,"close");
        this.packages.filter(obj=>obj.membershipId == id).map(obj=>{
          return obj.active = !status;
        });
      }else{
        this.showSnackbar("Server error",true,"close");
        event.source.checked = status;
      }
    },error=>{
      this.isToggling = false;
      console.log(error);
      event.source.checked = status;
      this.showSnackbar("connection error",true,"close");
    });    
  }
  getTooltipText(status:boolean){
    if(status){
      return "Deactivate";
    }else{
      return "Activate";
    }
  }

}
