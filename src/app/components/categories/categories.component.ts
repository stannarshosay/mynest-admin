import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AddCategoryComponent } from 'src/app/dialogs/add-category/add-category.component';
import { AddSubcategoryComponent } from 'src/app/dialogs/add-subcategory/add-subcategory.component';
import { EditCategoryComponent } from 'src/app/dialogs/edit-category/edit-category.component';
import { EditSubcategoryComponent } from 'src/app/dialogs/edit-subcategory/edit-subcategory.component';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  isGettingCategories:boolean = false;
  isGettingCategoriesSuccess:boolean = true;
  isGettingSubcategories:boolean = false;
  categories:any[]=[];
  subcategories:any[]=[];
  categoryChangedSubscription:Subscription;

  constructor(
    private categoryService:CategoryService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.categoryChangedSubscription = this.categoryService.getCategoryEditedObservable().subscribe(res=>{
      if(res){
        this.getAllCategories();
      }
    });
    this.getAllCategories();
  }
  ngOnDestroy():void{
     this.categoryChangedSubscription.unsubscribe();
     this.categoryService.hasCategoryEdited.next(false);
  }  
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  getAllCategories(){
    this.isGettingCategories = true;
    this.categoryService.getCategories().subscribe(res=>{
      this.isGettingCategories = false;
      if(res["success"]){
        this.categories = res["data"];
      }else{
        this.isGettingCategoriesSuccess = false;
        this.showSnackbar("Categories not found!",true,"close");
      }
    },error=>{
      this.isGettingCategories = false;
      this.isGettingCategoriesSuccess = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  getEncodedString(path:string){
    return encodeURIComponent(path);
  }
  getSubcategoriesByCategoryId(categoryId:string){
    this.isGettingSubcategories = true;
    this.subcategories = [];
    this.categoryService.getSubCategoriesById(categoryId).subscribe(res=>{
      this.isGettingSubcategories = false;
      if(res["success"]){
        this.subcategories = res["data"];       
      }else{
        this.showSnackbar("Subcategories not found!",true,"close");
      }
    },error=>{
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  openAddCategoryDialog(){
    const dialogRef = this.dialog.open(AddCategoryComponent);    

    dialogRef.afterClosed().subscribe(result => {
      if(result){        
        this.showSnackbar("Category added successfully!",true,"close");
        this.getAllCategories();
      }
    });    
  }
  openAddSubcategoryDialog(categoryId:string){
    const dialogRef = this.dialog.open(AddSubcategoryComponent,{
      data:{
        categoryId:categoryId
      }
    });    

    dialogRef.afterClosed().subscribe(result => {
      if(result){        
        this.showSnackbar("Subcategory added successfully!",true,"close");
        this.getSubcategoriesByCategoryId(categoryId);
      }
    });
    
  }
  editSubcategory(subcategory:any){
    const dialogRef = this.dialog.open(EditSubcategoryComponent,{
      data:{
        subcategory:subcategory
      }
    });    

    dialogRef.afterClosed().subscribe(result => {
      if(result){        
        this.showSnackbar("Subcategory edited successfully!",true,"close");
        this.getSubcategoriesByCategoryId(subcategory.categoryId);
      }
    });
  }
  editCategory(category:any){
    const dialogRef = this.dialog.open(EditCategoryComponent,{
      data:{
        category:category
      },
      width:"400px"
    }); 
  }
}
