import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-agent-remove-requests',
  templateUrl: './agent-remove-requests.component.html',
  styleUrls: ['./agent-remove-requests.component.css']
})
export class AgentRemoveRequestsComponent implements OnInit {
  beforeTooltip:TooltipPosition = "before";
  isGettingRequests:boolean = false;
  isGettingRequestsSuccess:boolean = true;
  isSettingStatus:boolean = false;
  requests:any[] = [];
  displayedColumns: string[] = ['vid','companyName','aid','firstName','type','reason','date','accept','reject'];
  pageNo:number = 0;
  pageSize:number = 10;
  config:any = {};
  constructor(
    private agentService:AgentService,
    private snackBar:MatSnackBar,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.pageNo+1;
    this.config["itemsPerPage"] = this.pageSize;
    this.getRequests();
  }
  pageChange(newPage: number){
    this.pageNo = newPage-1;
    this.getRequests();
  } 
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  getRequests(){
    this.config["totalItems"] = 0;    
    this.config["currentPage"] = this.pageNo+1;    
    this.config["itemsPerPage"] = this.pageSize;
    this.requests = [];
    this.isGettingRequests = true;
    this.isGettingRequestsSuccess = true;
    this.agentService.fetchAllRequests("removal",this.pageNo,this.pageSize).subscribe(res=>{
      this.isGettingRequests = false;
      if(res["success"]){
        this.config["totalItems"] = res["data"]["totalElements"];
        this.requests = res["data"]["content"]; 
      }else{     
        this.isGettingRequestsSuccess = false;
      }
    },error=>{
      this.showSnackbar("Connection Error",true,"close");
    });    
  }
  goToVendorProfile(vendorId:string){
    this.router.navigate(["/vendor-profile/"+vendorId]);
  }
  rejectRequest(requestId:string){
    this.isSettingStatus = true;
    this.showSnackbar("Rejecting Request...",false,"");
    this.agentService.agentRequestAction("REJECT",requestId).subscribe(res=>{
      this.isSettingStatus = false;
      if(res["success"]){
        this.getRequests();
        this.showSnackbar("Rejected request successfully!",true,"close");
      }else{     
        this.showSnackbar("Reject Server Error",true,"close");
      }
    },error=>{
      this.isSettingStatus = false;
      this.showSnackbar("Reject Connection Error",true,"close");
    });
  }
  acceptRequest(requestId:string){
    this.isSettingStatus = true;
    this.showSnackbar("Accepting Request...",false,"");
    this.agentService.agentRequestAction("ACCEPT",requestId).subscribe(res=>{
      this.isSettingStatus = false;
      if(res["success"]){
        this.getRequests();
        this.showSnackbar("Accepted request successfully!",true,"close");
      }else{     
        this.showSnackbar("Accept Server Error",true,"close");
      }
    },error=>{
      this.isSettingStatus = false;
      this.showSnackbar("Accept Connection Error",true,"close");
    });
  }
}
