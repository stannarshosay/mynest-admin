import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private http:HttpClient
  ) { }

  fetchAllCustomers(pageNo:number,pageSize:number){
    return this.http.get("https://mynestonline.com/collection/api/customer/get-all?pageNo="+pageNo+"&pageSize="+pageSize);
  }
  fetchCustomerById(customerId:string){
    return this.http.get("https://mynestonline.com/collection/api/customer-detail?customerId="+customerId);
  }
  toggleActiveStatus(paramData:any){
    return this.http.post("https://mynestonline.com/collection/api/user-activity",paramData);
  }
  changePassword(paramData:any){
    return this.http.post("https://mynestonline.com/collection/api/change-pass",paramData);
  }
  uploadProfilePic(fileFormData:any,customerId:string){
    return this.http.post("https://mynestonline.com/collection/api/customer/add-profile-pic?customerId="+customerId,fileFormData,{
      reportProgress: true,
      observe: 'events'
    });
  }
}
