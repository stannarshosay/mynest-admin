import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
  isAdding:boolean = false;
  categoryForm:FormGroup;
  iconPreview = [];
  iconFile:File=null;
  constructor(
    public dialogRef: MatDialogRef<EditCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar:MatSnackBar,
    private categoryService:CategoryService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {   
    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required]
    });
    this.categoryForm.get("categoryName").setValue(this.data.category.categoryName);
    this.iconPreview.push("https://mynestonline.com/collection/images/category-icons/"+encodeURIComponent(this.data.category.iconPath));
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  } 
  
  editCategoryName(){
      if(this.categoryForm.valid){
        this.isAdding = true;
        this.showSnackbar("Please be patient! saving category name...",false,"");
        this.categoryService.saveCategoryName(this.data.category.categoryId,this.categoryForm.get("categoryName").value).subscribe(res=>{
            this.isAdding = false;
            if(res["success"]){
              this.showSnackbar("Saved category name!",true,"close");
              this.categoryService.hasCategoryEdited.next(true);
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
  saveCategoryIcon(){
    if(this.iconFile){
        this.isAdding = true;
        this.showSnackbar("Please be patient! saving category icon...",false,"");
        const uploadData = new FormData();
        uploadData.append('categoryIcon', this.iconFile);
        this.categoryService.saveCategoryIcon(this.data.category.categoryId,uploadData).subscribe(res=>{
            this.isAdding = false;
            if(res["success"]){
              this.showSnackbar("Saved icon successfully!",true,"close");
              this.categoryService.hasCategoryEdited.next(true);
            }else{
              this.showSnackbar("Server error!",true,"close");
            }
        },error=>{  
          this.isAdding = false;       
          this.showSnackbar("Connection error!",true,"close");
          console.log(error);
        });     
    }else{
      this.showSnackbar("Please select a icon",true,"close");
    }
  }
  onIconSelect(event:any,fileInput:any){
    var _size = event.target.files[0].size;
    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),i=0;
        while(_size>900)
        {
          _size/=1024;
          i++;
        }
    if((((Math.round(_size*100)/100)>500)&&(i==1))||(i==3)||(i==2)){
      this.showSnackbar("File size is larger than 500 KB",true,"okay");
    }else{
      this.iconPreview = [];
      this.iconFile = event.target.files[0];  
      var reader = new FileReader();   
      reader.onload = (event:any) => {
        this.iconPreview.push(event.target.result);  
      } 
      reader.readAsDataURL(event.target.files[0]);
    }   
  }


}
