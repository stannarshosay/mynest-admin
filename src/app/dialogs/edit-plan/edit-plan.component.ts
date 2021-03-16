import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { PlanService } from 'src/app/services/plan.service';

@Component({
  selector: 'app-edit-plan',
  templateUrl: './edit-plan.component.html',
  styleUrls: ['./edit-plan.component.css']
})
export class EditPlanComponent implements OnInit {
  isEditing:boolean = false;
  planForm:FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EditPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar:MatSnackBar,
    private planService:PlanService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.planForm = this.fb.group({
      price:["",Validators.required],
      sellingPrice:["",Validators.required]
    });
    this.planForm.patchValue(this.data.plan);
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  } 
  
  editPlan(){
    if(this.planForm.valid){
      this.isEditing = true;
      this.showSnackbar("Please be patient! editing plan...",false,"");
      let paramData = this.planForm.value;
      paramData["membershipId"] = this.data.plan.membershipId;
      this.planService.editPlan(paramData).subscribe(res=>{
          this.isEditing = false;
          if(res["success"]){
            this.showSnackbar("Editing successfull...",false,"");
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
