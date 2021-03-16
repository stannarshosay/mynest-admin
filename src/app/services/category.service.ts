import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  public hasCategoryEdited = new BehaviorSubject<boolean>(false);
  
  constructor(
    private http:HttpClient
  ) { }
  getCategoryEditedObservable():Observable<boolean>{
    return this.hasCategoryEdited.asObservable();
  }
  getSubCategoriesByVendorId(vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/sub-category-vendor?vendorId="+vendorId,null);
  }
  getSubCategoriesById(categoryId:string){
    return this.http.post("https://mynestonline.com/collection/api/sub-category?categoryId="+categoryId,null);
  }  
  getCategories(){
    return this.http.get("https://mynestonline.com/collection/api/categories");
  }
  addCategory(uploadData:any){
    return this.http.post("https://mynestonline.com/collection/api/category/create",uploadData);
  }
  saveCategoryName(categoryId:string,CategoryName:string){
    return this.http.put("https://mynestonline.com/collection/api/category/edit-name?categoryId="+categoryId+"&categoryName="+CategoryName,null);
  }
  saveCategoryIcon(categoryId:string,uploadData:any){
    return this.http.put("https://mynestonline.com/collection/api/category/edit-icon?categoryId="+categoryId,uploadData);
  }
  addSubcategory(paramData:any){
    return this.http.post("https://mynestonline.com/collection/api/sub-category/add",paramData);
  }
  editSubcategory(paramData:any){
    return this.http.put("https://mynestonline.com/collection/api/sub-category/edit",paramData);
  }
}
