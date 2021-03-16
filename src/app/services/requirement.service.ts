import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {

  constructor(
    private http:HttpClient
  ) { }

  rejectReportByReportId(reportId:string){
    return this.http.post("https://mynestonline.com/collection/api/reported-requirement/reject?reportId="+reportId,null);
  }
  acceptReportByReportId(reportId:string){
    return this.http.post("https://mynestonline.com/collection/api/reported-requirement/accept?reportId="+reportId,null);
  }
  fetchReportedRequirements(){
    return this.http.get("https://mynestonline.com/collection/api/reported/get-requirements");
  }
  fetchAllRequirements(status:string,pageNo:number,pageSize:number){
    return this.http.get("https://mynestonline.com/collection/api/requirements?status="+status+"&pageNo="+pageNo+"&pageSize="+pageSize);
  }
}
