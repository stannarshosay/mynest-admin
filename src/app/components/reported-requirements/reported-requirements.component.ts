import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { RequirementService } from 'src/app/services/requirement.service';

@Component({
  selector: 'app-reported-requirements',
  templateUrl: './reported-requirements.component.html',
  styleUrls: ['./reported-requirements.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ReportedRequirementsComponent implements OnInit {
  beforeTooltip:TooltipPosition = "before";
  isGettingRequirements:boolean = false;
  isGettingRequirementsSuccess:boolean = true;
  isSettingStatus:boolean = false;
  requirements:any[] = [];
  displayedColumns: string[] = ['reportingvendorid','reportedcustomer','reason','reportedcount','reporteddate','accept','reject'];

  constructor(
    private requirementService:RequirementService,
    private snackBar:MatSnackBar,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.getReportedRequirements();
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  getReportedRequirements(){
    this.requirements = [];
    this.isGettingRequirements = true;
    this.isGettingRequirementsSuccess = true;
    this.requirementService.fetchReportedRequirements().subscribe(res=>{
      this.isGettingRequirements = false;
      if(res["success"]){
        this.requirements = res["data"];   
        this.showSnackbar("Click on rows to view full details",true,"okay");
      }else{     
        this.isGettingRequirementsSuccess = false;
      }
    },error=>{
      this.showSnackbar("Connection Error",true,"close");
    });
  }
  goToVendorProfile(vendorId:string){
    this.router.navigate(["/vendor-profile/"+vendorId]);
  }
  goToCustomerProfile(customerId:string){
    this.router.navigate(["/customer-profile/"+customerId]);
  }
  rejectReport(reportId:string){
    this.isSettingStatus = true;
    this.showSnackbar("Rejecting Report...",false,"");
    this.requirementService.rejectReportByReportId(reportId).subscribe(res=>{
      this.isSettingStatus = false;
      if(res["success"]){
        this.getReportedRequirements();
        this.showSnackbar("Rejected report successfully!",true,"close");
      }else{     
        this.showSnackbar("Reject Server Error",true,"close");
      }
    },error=>{
      this.isSettingStatus = false;
      this.showSnackbar("Reject Connection Error",true,"close");
    });
  }
  acceptReport(reportId:string){
    this.isSettingStatus = true;
    this.showSnackbar("Accepting Report...",false,"");
    this.requirementService.acceptReportByReportId(reportId).subscribe(res=>{
      this.isSettingStatus = false;
      if(res["success"]){
        this.getReportedRequirements();
        this.showSnackbar("Accepted report successfully!",true,"close");
      }else{     
        this.showSnackbar("Accept Server Error",true,"close");
      }
    },error=>{
      console.log(error);
      this.isSettingStatus = false;
      this.showSnackbar("Accept Connection Error",true,"close");
    });
  }
  getEncodedString(path:string){
    return encodeURIComponent(path);
  }
}
