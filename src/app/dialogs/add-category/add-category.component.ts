import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  isAdding:boolean = false;
  iconPreview = [];
  subCategories: FormArray = new FormArray([]);
  iconFile:File=null;
  categoryForm:FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar:MatSnackBar,
    private categoryService:CategoryService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required],
      subCategories: this.fb.array([this.createItem()])
    });
    this.subCategories = this.categoryForm.get('subCategories') as FormArray;
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  } 
  get subCategoryFormGroup() {
    return this.categoryForm.get('subCategories') as FormArray;
  }
  createItem(): FormGroup {
    return this.fb.group({
      subCategoryName:["",Validators.required],
      description:["",Validators.required]
    });
  }
  addItem(): void {
    this.subCategories.push(this.createItem());
  }
  removeItem(index:number) {
    this.subCategories.removeAt(index);
  }
  addCategory(){
    if(this.iconFile){
        if(this.categoryForm.valid){
        this.isAdding = true;
        this.showSnackbar("Please be patient! adding category...",false,"");
        let paramData = this.categoryForm.value;
        const uploadData = new FormData();
        uploadData.append('categoryIcon', this.iconFile);
        uploadData.append('categoryDTO',new Blob([JSON.stringify(paramData)], { type: "application/json"}));
        this.categoryService.addCategory(uploadData).subscribe(res=>{
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
    }else{
      this.showSnackbar("Please select a icon",true,"close");
    }
  }
  
  onIconSelect(event:any,fileInput:any){
    this.iconPreview = [];
    this.iconFile = event.target.files[0];  
    var reader = new FileReader();   
    reader.onload = (event:any) => {
      this.iconPreview.push(event.target.result);  
    } 
    reader.readAsDataURL(event.target.files[0]);
  }
}
