import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-add-subcategory',
  templateUrl: './add-subcategory.component.html',
  styleUrls: ['./add-subcategory.component.css']
})
export class AddSubcategoryComponent implements OnInit {
  isAdding:boolean = false;
  subcategoryForm:FormGroup;
  maxChars:string = "400";
  constructor(
    public dialogRef: MatDialogRef<AddSubcategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar:MatSnackBar,
    private categoryService:CategoryService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.subcategoryForm = this.fb.group({
      subCategoryName:["",Validators.required],
      description:["",Validators.required]
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
  
  addSubcategory(){
    if(this.subcategoryForm.valid){
      this.isAdding = true;
      this.showSnackbar("Please be patient! adding subcategory...",false,"");
      let paramData = this.subcategoryForm.value;
      paramData["categoryId"] = this.data.categoryId;  
      this.categoryService.addSubcategory(paramData).subscribe(res=>{
          this.isAdding = false;
          if(res["success"]){
            this.dialogRef.close(true);
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
      },error=>{  
        this.isAdding = false;       
        this.showSnackbar("Connection error!",true,"close");
      });
    }else{
      this.showSnackbar("Please fill all fields",true,"close");
    }
    
  }

}
