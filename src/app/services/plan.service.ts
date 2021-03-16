import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(
    private http:HttpClient
  ) { }
  getAllPackages():Observable<any>{
    return this.http.get("https://mynestonline.com/collection/api/membership-plans");
  }
  togglePackageStatus(paramData:any):Observable<any>{
    return this.http.post("https://mynestonline.com/collection/api/membership/change-activity",paramData);
  }
  editPlan(paramData:any){
    return this.http.post("https://mynestonline.com/collection/api/membership/change-price",paramData);
  }
  
}
