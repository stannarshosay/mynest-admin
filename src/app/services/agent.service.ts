import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  constructor(private http:HttpClient) { }

  addAgent(paramData:any):Observable<any>{
    return this.http.post("https://mynestonline.com/collection/api/user/agent",paramData);
  }
  addAnnouncement(paramData:any){
    return this.http.post("https://mynestonline.com/collection/api/agent-announcement/create",paramData);
  }
  getAllAnnouncements(){
    return this.http.get("https://mynestonline.com/collection/api/agent-announcements");
  }
  deleteAnnouncementById(id:string){
    return this.http.delete("https://mynestonline.com/collection/api/agent-announcement/delete/"+id);
  }
  getDropdownVendors(district:string){
    return this.http.get("https://mynestonline.com/collection/api/vendor/location?district="+district);
  }
  addVendor(agentId:string,vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/agent/vendor/add?agentId="+agentId+"&vendorId="+vendorId,null);
  }
  fetchAgentsByFilter(paramData:any,pageNo:number,pageSize:number){
    let api = "https://mynestonline.com/collection/api/agents?pageNo="+pageNo+"&pageSize="+pageSize;
    if(!paramData["isActive"]){
      api = api + "&activity=disabled";
    }
    if(paramData["location"]!=undefined){
      api = api + "&location="+paramData["location"];
    }
    return this.http.get(api);
  }
  fetchAgentsBySearchTerm(term:any,pageNo:any,pageSize:any){
    return this.http.get("https://mynestonline.com/collection/api/agents/search?searchText="+term+"&pageNo="+pageNo+"&pageSize="+pageSize);
  }
  toggleActiveStatus(paramData:any){
    if(paramData["enabled"]){
      return this.http.post("https://mynestonline.com/collection/api/user-activity",paramData);
    }else{
      return this.http.put("https://mynestonline.com/collection/api/agent/disable?agentId="+paramData["id"],null);
    }
  }
  deleteAgent(agentId:string){
    return this.http.put("https://mynestonline.com/collection/api/agent/delete?agentId="+agentId,null);
  }
  fetchVendorsByFilter(paramData:any,pageNo:number,pageSize:number){
    let api = "https://mynestonline.com/collection/api/agent/vendors?pageNo="+pageNo+"&pageSize="+pageSize+"&agentId="+paramData["id"];
    if(paramData["membershipName"]!=undefined){
      api = api + "&plan="+paramData["membershipName"];
    }
    if(paramData["verified"]!=undefined){
      api = api + "&verified="+paramData["verified"];
    }
    return this.http.get(api);
  }
  fetchVendorsBySearchTerm(agentId:string,term:any,pageNo:any,pageSize:any){
    return this.http.get("https://mynestonline.com/collection/api/agent/vendors/search?searchText="+term+"&pageNo="+pageNo+"&pageSize="+pageSize+"&agentId="+agentId);
  }
  deleteVendor(vendorId:string,agentId:string){
    return this.http.delete("https://mynestonline.com/collection/api/agent/vendor/delete?agentId="+agentId+"&vendorId="+vendorId);
  }
  getDetailsByVendorId(vendorId:string){
    return this.http.get("https://mynestonline.com/collection/api/agent/vendor?vendorId="+vendorId);
  }
  getAgentDetailsByVendorId(vendorId:string){
    return this.http.get("https://mynestonline.com/collection/api/vendor/agent?vendorId="+vendorId);
  }
  fetchAllRequests(status:string,pageNo:number,pageSize:number){
    return this.http.get("https://mynestonline.com/collection/api/requests?type="+status+"&pageNo="+pageNo+"&pageSize="+pageSize);
  }
  agentRequestAction(action:string,requestId:string){
    return this.http.put("https://mynestonline.com/collection/api/request/action?action="+action+"&requestId="+requestId,null);
  }
}
