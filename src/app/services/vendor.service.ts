import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(
    private http:HttpClient
  ) { }

  fetchVendorsByFilter(paramData:any,pageNo:number,pageSize:number){
    return this.http.post("https://mynestonline.com/collection/api/get-vendors?pageNo="+pageNo+"&pageSize="+pageSize,paramData);
  }
  fetchVendorsBySearchTerm(term:any){
    return this.http.post("https://mynestonline.com/collection/api/search-vendors?searchText="+term,null);
  }
  
  rejectReportByVendorReportId(reportId:string){
    return this.http.post("https://mynestonline.com/collection/api/report-vendor/reject?vendorReportId="+reportId,null);
  }
  acceptReportByVendorReportId(reportId:string){
    return this.http.post("https://mynestonline.com/collection/api/report-vendor/accept?vendorReportId="+reportId,null);
  }
  fetchReportedVendors(){
    return this.http.get("https://mynestonline.com/collection/api/reported/get-vendors");
  }
  getAllLocations(){
    return this.http.get("https://mynestonline.com/collection/api/locations");
  }
  getAllPlans(){
    return this.http.get("https://mynestonline.com/collection/api/membership-plans");
  }
  toggleActiveStatus(paramData:any){
    return this.http.post("https://mynestonline.com/collection/api/user-activity",paramData);
  }
  verifyVendor(vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/verify-profile?vendorId="+vendorId,null);
  }
  getVendorProfileDetails(vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/vendor-profile?vendorId="+vendorId,null);
  }
  
  getPreferredLocations(vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/preferred-locations?vendorId="+vendorId,null);
  }
  getGalleryImages(vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/gallery-images?vendorId="+vendorId,null);
  }
  deleteGalleryImage(vendorId:string,imageName:string){
    return this.http.delete("https://mynestonline.com/collection/api/delete-gallery-image?vendorId="+vendorId+"&imageName="+imageName);
  }
  editVendorCompanyDetails(formData:any){
    return this.http.post("https://mynestonline.com/collection/api/add-details",formData);
  }
  editServices(formData:any){
    return this.http.post("https://mynestonline.com/collection/api/edit-services",formData);
  }
  changePassword(paramData:any){
    return this.http.post("https://mynestonline.com/collection/api/change-pass",paramData);
  }
  editPreferredLocations(formData:any){
    return this.http.post("https://mynestonline.com/collection/api/edit-pref-locations",formData);
  }
  uploadProfilePic(fileFormData:any,vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/add-profile-pic?vendorId="+vendorId,fileFormData,{
      reportProgress: true,
      observe: 'events'
    });
  }
  uploadLogoPic(fileFormData:any,vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/add-logo?vendorId="+vendorId,fileFormData,{
      reportProgress: true,
      observe: 'events'
    });
  }
  uploadBrochure(fileFormData:any,vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/add-brochure?vendorId="+vendorId,fileFormData,{
      reportProgress: true,
      observe: 'events'
    });
  }
  uploadGalleryPic(fileFormData:any,vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/save-gallery-images?vendorId="+vendorId,fileFormData,{
      reportProgress: true,
      observe: 'events'
    });
  }
}
