import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  afterTooltip:TooltipPosition = "after";
  isGettingCustomers:boolean = false;
  isGettingCustomersSuccess:boolean = true;
  isToggling:boolean = false;
  pageNo:number = 0;
  pageSize:number = 10;
  config:any = {};
  displayedColumns: string[] = ['id','logo','email','phone','username', 'registereddate','toggleactivestatus'];
  customers:any[] = [];
  constructor(
    private customerService:CustomerService,
    private snackBar:MatSnackBar,
    private router:Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {    
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.pageNo+1;
    this.config["itemsPerPage"] = this.pageSize;
    this.getCustomers();
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  
  getCustomers(){
    this.config["totalItems"] = 0;    
    this.config["currentPage"] = this.pageNo+1;
    this.config["itemsPerPage"] = this.pageSize;
    this.customers = [];
    this.isGettingCustomers = true;
    this.isGettingCustomersSuccess = true;
    this.customerService.fetchAllCustomers(this.pageNo,this.pageSize).subscribe(res=>{
      this.isGettingCustomers = false;
      if(res["success"]){
        this.config["totalItems"] = res["data"]["totalElements"];
        this.customers = res["data"]["content"];
      }else{     
        this.isGettingCustomersSuccess = false;
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
  changeActiveStatus(event:any,customerId:string,enabled:boolean){
    this.isToggling = true;
    this.showSnackbar(enabled?"Deactivating...":"Activating...",false,"");
    let paramData = {};
    paramData["id"] = customerId;
    paramData["enabled"] = !enabled;
    this.customerService.toggleActiveStatus(paramData).subscribe(res=>{
      this.isToggling =false;
      if(res["success"]){
        this.showSnackbar(enabled?"Deactivated successfully!":"Activated successfully!",true,"close");
        this.getCustomers();
      }else{
        event.source.checked = enabled;
        this.showSnackbar("Toggle status server error!",true,"close");
      }
    },error=>{
      this.isToggling = false;
      event.source.checked = enabled;
      this.showSnackbar("Toggle status connection error!",true,"close");
    });    
  }
  pageChange(newPage: number){
      this.pageNo = newPage -1;
      this.getCustomers();
  } 
  getStatusTooltip(enabled:boolean){
    return enabled?'Toggle to deactivate':'Toggle to activate';
  }  
  goToCustomerProfile(customerId:string){
    this.router.navigate(["/customer-profile/"+customerId]);
  }  
}
