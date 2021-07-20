import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AdvertisementService } from 'src/app/services/advertisement.service';

@Component({
  selector: 'app-requested-ads',
  templateUrl: './requested-ads.component.html',
  styleUrls: ['./requested-ads.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class RequestedAdsComponent implements OnInit {

  beforeTooltip:TooltipPosition = "before";
  isGettingRequestedAds:boolean = false;
  isGettingRequestedAdsSuccess:boolean = true;
  isSettingStatus:boolean = false;
  pageNo:number = 0;
  pageSize:number = 10;
  ads:any[] = [];
  config = {};
  displayedColumns: string[] = ['vendor','bookeddate','location','category','startingdate','endingdate','accept','reject'];

  constructor(
    private adService:AdvertisementService,
    private snackBar:MatSnackBar,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.pageNo+1;
    this.config["itemsPerPage"] = this.pageSize;
    this.getRequestedAds();
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  getRequestedAds(){
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.pageNo+1;
    this.config["itemsPerPage"] = this.pageSize;
    this.ads = [];
    this.isGettingRequestedAds = true;
    this.isGettingRequestedAdsSuccess = true;
    this.adService.fetchRequestedAds("SERVICE_LISTING",this.pageNo,this.pageSize).subscribe(res=>{
      this.isGettingRequestedAds = false;
      if(res["success"]){
        this.config["totalItems"] = res["data"]["totalElements"];
        this.ads = res["data"]["content"];        
        this.showSnackbar("Click on rows to view ad",true,"okay");
      }else{     
        this.isGettingRequestedAdsSuccess = false;
      }
    },error=>{
      this.showSnackbar("Connection Error",true,"close");
    });
  }
  goToVendorProfile(vendorId:string){
    this.router.navigate(["/vendor-profile/"+vendorId]);
  }
  rejectAd(vendorAdId:string){
    this.isSettingStatus = true;
    this.showSnackbar("Rejecting Ad...",false,"");
    this.adService.rejectAdByVendorAdId(vendorAdId).subscribe(res=>{
      this.isSettingStatus = false;
      if(res["success"]){
        if((this.ads.length==1)&&(this.pageNo!=0)){
          this.pageNo = this.pageNo-1;
        }
        this.getRequestedAds();
        this.showSnackbar("Rejected Ad successfully!",true,"close");
      }else{     
        this.showSnackbar("Reject Server Error",true,"close");
      }
    },error=>{
      this.isSettingStatus = false;
      this.showSnackbar("Reject Connection Error",true,"close");
    });
  }
  acceptAd(vendorAdId:string){
    this.isSettingStatus = true;
    this.showSnackbar("Accepting Ad...",false,"");
    this.adService.acceptAdByVendorAdId(vendorAdId).subscribe(res=>{
      this.isSettingStatus = false;
      if(res["success"]){
        if((this.ads.length==1)&&(this.pageNo!=0)){
          this.pageNo = this.pageNo-1;
        }
        this.getRequestedAds();
        this.showSnackbar("Accepted Ad successfully!",true,"close");
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
  pageChange(newPage: number){
      this.pageNo = newPage-1;
      this.getRequestedAds();
  } 
}
