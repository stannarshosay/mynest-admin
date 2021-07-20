import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { BuisnessDetailsComponent } from 'src/app/dialogs/buisness-details/buisness-details.component';
import { DeleteCommonComponent } from 'src/app/dialogs/delete-common/delete-common.component';
import { AgentService } from 'src/app/services/agent.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-agents-vendors',
  templateUrl: './agents-vendors.component.html',
  styleUrls: ['./agents-vendors.component.css']
})
export class AgentsVendorsComponent implements OnInit {
  agentId:any;
  agentDistrict:any;
  afterTooltip:TooltipPosition = "after";
  isGettingVendors:boolean = false;
  isGettingVendorsSuccess:boolean = true;
  isSearchEnabled:boolean = false;
  isGettingDropdown:boolean = true;
  activePageNo:number = 0;
  searchPageNo:number = 0;
  pageSize:number = 10;
  config:any = {};
  vendorFormControl = new FormControl();
  membershipFormControl = new FormControl();
  searchFormControl = new FormControl();
  verifyFormControl = new FormControl();
  plans:any[] = [];
  displayedColumns: string[] = ['id','logo','email','phone','companyname', 'registereddate', 'membership','profilestatus','verificationstatus','view','delete'];
  vendors:any[] = [];
  vendorDropdown:any[] = [];
  constructor(
    private activatedRoute:ActivatedRoute,
    private vendorService:VendorService,
    private agentService:AgentService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog,
    private router:Router
  ) { 
    
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.agentId= params.get('agentId');
      this.agentDistrict= params.get('agentDistrict');
    });
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.activePageNo+1;
    this.config["itemsPerPage"] = this.pageSize;
    this.getPlans();
    this.getVendors();
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  } 
  getPlans(){
    this.isGettingVendors = true;
    this.vendorService.getAllPlans().subscribe(res=>{
      if(res["success"]){
        this.plans = res["data"];
        this.getVendorsByFilter();
      }else{
        this.showSnackbar("Plans fetch server error",true,"close");
      }
    },error=>{
      this.showSnackbar("Plans fetch connection error",true,"close");
    })
  }
  getVendorsByFilter(){
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.activePageNo+1;   
    this.config["itemsPerPage"] = this.pageSize;    
    let paramData = {};
    paramData["id"] = this.agentId;
    if(this.membershipFormControl.value){
      paramData["membershipName"] = this.membershipFormControl.value;
    }
    if(this.verifyFormControl.value){
      paramData["verified"] = this.verifyFormControl.value;
    }
    this.vendors = [];
    this.isGettingVendors = true;
    this.isGettingVendorsSuccess = true;
    this.agentService.fetchVendorsByFilter(paramData,this.activePageNo,this.pageSize).subscribe(res=>{
      this.isGettingVendors = false;
      if(res["success"]){
        this.config["totalItems"] = res["data"]["totalElements"];
        this.vendors = res["data"]["content"];
      }else{     
        this.isGettingVendorsSuccess = false;
      }
    },error=>{
      this.showSnackbar("Connection Error",true,"close");
    });
  }
  getImagePath(image:any){
    if((image)&&(image!="")){
      return encodeURIComponent(image);
    }else{
      return encodeURIComponent("default.jpg");
    }
  }
  pageChange(newPage: number){
    if(this.isSearchEnabled){
      this.searchPageNo = newPage -1;
      this.searchVendors(false);
    }else{
      this.activePageNo = newPage-1;
      this.getVendorsByFilter();
    }
  } 
  searchVendors(shouldReset:boolean){
    if(this.searchFormControl.value != ""){
      if(shouldReset){
        this.searchPageNo = 0;
      }
      this.config["totalItems"] = 0;    
      this.config["currentPage"] = this.searchPageNo+1;
      this.config["itemsPerPage"] = this.pageSize;
      this.vendors = [];
      this.isGettingVendors = true;
      this.isGettingVendorsSuccess = true;
      this.agentService.fetchVendorsBySearchTerm(this.agentId,this.searchFormControl.value,this.searchPageNo,this.pageSize).subscribe(res=>{
        this.isGettingVendors = false;
        if(res["success"]){
          this.config["totalItems"] = res["data"]["totalElements"];
          this.vendors = res["data"]["content"];
        }else{  
          this.isGettingVendorsSuccess = false;
        }
      },error=>{
        this.showSnackbar("Connection Error",true,"close");
      });
    }
  }
  onFilterChange(){
    this.activePageNo = 0;
    this.getVendorsByFilter();
  }
  resetAll(){
    this.isSearchEnabled = false;
    this.membershipFormControl.setValue("");
    this.searchFormControl.setValue("");
    this.verifyFormControl.setValue("");
    this.vendorFormControl.setValue("");
    this.activePageNo = 0;
    this.searchPageNo = 0;
    this.getVendorsByFilter();
    this.getVendors();
  }
  openVendorBuisnessDetails(vendorId:string){
    const dialogRef = this.dialog.open(BuisnessDetailsComponent,{
      data:vendorId
    });   

    dialogRef.afterClosed().subscribe(result => {
      console.log("dialog closed");
    });
  }
  deleteVendor(event:any,vendorId:string){
    const dialogRef = this.dialog.open(DeleteCommonComponent);    

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.vendors = [];
        this.isGettingVendors = true;
        this.agentService.deleteVendor(vendorId,this.agentId).subscribe(res=>{
            this.isGettingVendors = false;
            if(res["success"]){
              this.showSnackbar("Vendor Removed Successfully",true,"close");
              this.resetAll();
            }else{  
              this.showSnackbar("Server Error",true,"close");
            }
          },error=>{
            this.isGettingVendors = false;
            this.showSnackbar("Connection Error",true,"close");
          });
      }
    });    
  }
  getVendors(){
    this.vendorDropdown = [];
    this.isGettingDropdown = true;
    this.agentService.getDropdownVendors(this.agentDistrict).subscribe(res=>{
      if(res["success"]){
        this.vendorDropdown = res["data"];
        this.isGettingDropdown = false;
      }else{
        this.showSnackbar("No vendors to add",true,"close");
      }
    },error=>{
      this.showSnackbar("fetch connection error",true,"close");
    })
  }
  addVendor(){
    this.showSnackbar("Please Wait, Adding!",true,"close");
    if(this.vendorFormControl.value){
      this.isGettingDropdown = true;
      this.agentService.addVendor(this.agentId,this.vendorFormControl.value).subscribe(res=>{
        this.isGettingDropdown = false;
        if(res["success"]){
          this.showSnackbar("Vendor Added Successfully!",true,"close");
          this.resetAll();
        }else{
          this.showSnackbar("fetch server error",true,"close");
        }
      },error=>{
        this.isGettingDropdown = false;
        this.showSnackbar("fetch connection error",true,"close");
      });
    }else{
      this.showSnackbar("Please choose a vendor",true,"close");
    }
  }
  checkEmpty(){
    if(!this.vendorDropdown.length){
      this.showSnackbar("No vendors to add",true,"close");
    }
  }
  goToVendorProfile(vendorId:string){
    this.router.navigate(["/vendor-profile/"+vendorId]);   
  }
}
