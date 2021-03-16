import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-reported-vendors',
  templateUrl: './reported-vendors.component.html',
  styleUrls: ['./reported-vendors.component.css']
})
export class ReportedVendorsComponent implements OnInit {
  beforeTooltip:TooltipPosition = "before";
  isGettingVendors:boolean = false;
  isGettingVendorsSuccess:boolean = true;
  isSettingStatus:boolean = false;
  vendors:any[] = [];
  displayedColumns: string[] = ['id','vendor','customer','reason','date','accept','reject'];

  constructor(
    private vendorService:VendorService,
    private snackBar:MatSnackBar,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.getReportedVendors();
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  getReportedVendors(){
    this.vendors = [];
    this.isGettingVendors = true;
    this.isGettingVendorsSuccess = true;
    this.vendorService.fetchReportedVendors().subscribe(res=>{
      this.isGettingVendors = false;
      if(res["success"]){
        this.vendors = res["data"];
      }else{     
        this.isGettingVendorsSuccess = false;
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
    this.vendorService.rejectReportByVendorReportId(reportId).subscribe(res=>{
      this.isSettingStatus = false;
      if(res["success"]){
        this.getReportedVendors();
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
    this.vendorService.acceptReportByVendorReportId(reportId).subscribe(res=>{
      this.isSettingStatus = false;
      if(res["success"]){
        this.getReportedVendors();
        this.showSnackbar("Accepted report successfully!",true,"close");
      }else{     
        this.showSnackbar("Accept Server Error",true,"close");
      }
    },error=>{
      this.isSettingStatus = false;
      this.showSnackbar("Accept Connection Error",true,"close");
    });
  }
}
