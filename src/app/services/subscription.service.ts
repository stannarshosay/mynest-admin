import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(
    private http:HttpClient
  ) { }
  getPlansByVendorId(vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/subscription-details?vendorId="+vendorId,null);
  }
}
