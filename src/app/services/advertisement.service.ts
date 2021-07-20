import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {
  constructor(
    private http:HttpClient
  ) { }

  rejectAdByVendorAdId(vendorAdId:string){
    return this.http.post("https://mynestonline.com/collection/api/advertisement/reject?vendorAdId="+vendorAdId,null);
  }
  acceptAdByVendorAdId(vendorAdId:string){
    return this.http.post("https://mynestonline.com/collection/api/advertisement/accept?vendorAdId="+vendorAdId,null);
  }
  fetchRequestedAds(adType:string,pageNo:number,pageSize:number){
    return this.http.post("https://mynestonline.com/collection/api/advertisement/requested?adType="+adType+"&pageNo="+pageNo+"&pageSize="+pageSize,null);
  }
  getAllSlots(params:any){
    return this.http.post("https://mynestonline.com/collection/api/available-slots",params);
  }
  editSlotPrice(params:any){
    return this.http.post("https://mynestonline.com/collection/api/slots/change-price",params);
  }
  getHomeGalleryImagesByType(adType:string){
    return this.http.get("https://mynestonline.com/collection/api/admin-ad?adType="+adType);
  }
  uploadAdPicByAdType(fileFormData:any,adType:string,link:any){
    return this.http.post("https://mynestonline.com/collection/api/upload/admin-ads?adType="+adType+"&link="+link,fileFormData,{
      reportProgress: true,
      observe: 'events'
    });
  }
  deleteHomeAdImage(id:string){
    return this.http.delete("https://mynestonline.com/collection/api/delete/admin-ad?id="+id);
  }
  changeAllBasePrice(basePrice:any){
    return this.http.put("https://mynestonline.com/collection/api/advertisement/baseprice/change-all?basePrice="+basePrice,null);
  }
  changeAllDuration(duration:any){
    return this.http.put("https://mynestonline.com/collection/api/advertisement/duration/change-all?duration="+duration,null);
  }
  changeBasePrice(params:any){
    return this.http.put("https://mynestonline.com/collection/api/advertisement/baseprice/change",params);
  }
  changeDuration(params:any){
    return this.http.put("https://mynestonline.com/collection/api/advertisement/duration/change",params);
  }
}
