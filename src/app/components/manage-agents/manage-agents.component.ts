import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AddAgentComponent } from 'src/app/dialogs/add-agent/add-agent.component';
import { DeleteCommonComponent } from 'src/app/dialogs/delete-common/delete-common.component';
import { AgentService } from 'src/app/services/agent.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-manage-agents',
  templateUrl: './manage-agents.component.html',
  styleUrls: ['./manage-agents.component.css']
})
export class ManageAgentsComponent implements OnInit {

  afterTooltip:TooltipPosition = "after";
  isGettingAgents:boolean = false;
  isGettingAgentsSuccess:boolean = true;
  isToggling:boolean = false;
  isActive:boolean = true;
  isSearchEnabled:boolean = false;
  activePageNo:number = 0;
  inactivePageNo:number = 0;
  searchPageNo:number = 0;
  pageSize:number = 10;
  config:any = {};
  activeFormControl = new FormControl("active");
  locationFormControl = new FormControl();
  searchFormControl = new FormControl();
  locations:any[] = [];
  plans:any[] = [];
  displayedColumns: string[] = ['id','firstname','lastname','email','phone','location','registereddate', 'refferal','toggleactivestatus','delete','view'];
  agents:any[] = [];
  constructor(
    private agentService:AgentService,
    private vendorService:VendorService,
    private snackBar:MatSnackBar,
    private router:Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {    
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.activePageNo+1;
    this.config["itemsPerPage"] = this.pageSize;
    this.getLocations();
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  getLocations(){    
    this.isGettingAgents = true;
    this.vendorService.getAllLocations().subscribe(res=>{
      if(res["success"]){
        this.locations = res["data"];
        this.getAgentsByFilter();
      }else{
        this.showSnackbar("Location fetch server error",true,"close");
      }
    },error=>{
      this.showSnackbar("Location fetch connection error",true,"close");
    })
  }  
  getAgentsByFilter(){
    this.config["totalItems"] = 0;
    if(this.activeFormControl.value == "active"){
      this.isActive = true;
    }else{
      this.isActive = false;
    }
    if(this.isActive){
      this.config["currentPage"] = this.activePageNo+1;
    }else{
      this.config["currentPage"] = this.inactivePageNo+1;
    }
    this.config["itemsPerPage"] = this.pageSize;    
    let paramData = {};
    paramData["isActive"] = this.isActive;
    if(this.locationFormControl.value){
      paramData["location"] = this.locationFormControl.value;
    }
    this.agents = [];
    this.isGettingAgents = true;
    this.isGettingAgentsSuccess = true;
    this.agentService.fetchAgentsByFilter(paramData,this.isActive?this.activePageNo:this.inactivePageNo,this.pageSize).subscribe(res=>{
      this.isGettingAgents = false;
        if(res["success"]){
          this.config["totalItems"] = res["data"]["totalElements"];
          this.agents = res["data"]["content"];
        }else{     
          this.isGettingAgentsSuccess = false;
        }    
    },error=>{
      this.showSnackbar("Connection Error",true,"close");
    });
  }
  changeActiveStatus(event:any,agentId:string,enabled:boolean){
    this.isToggling = true;
    this.showSnackbar(enabled?"Deactivating...":"Activating...",false,"");
    let paramData = {};
    paramData["id"] = agentId;
    paramData["enabled"] = !enabled;
    this.agentService.toggleActiveStatus(paramData).subscribe(res=>{
      this.isToggling =false;
      if(res["success"]){
        this.showSnackbar(enabled?"Deactivated successfully!":"Activated successfully!",true,"close");
        if(this.isActive){
          if((this.agents.length==1)&&(this.activePageNo!=0)){
            this.activePageNo = this.activePageNo-1;
          }
        }
        if(!this.isActive){
          if((this.agents.length==1)&&(this.inactivePageNo!=0)){
            this.inactivePageNo = this.inactivePageNo-1;
          }
        }
        if(!this.isSearchEnabled){       
           this.getAgentsByFilter(); 
        }
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
    if(this.isActive){
      this.activePageNo = newPage-1;
      this.getAgentsByFilter();
    }
    if(!this.isActive){
      this.inactivePageNo = newPage -1;
      this.getAgentsByFilter();
    }
    if(this.isSearchEnabled){
      this.searchPageNo = newPage -1;
      this.searchAgents(false);
    }
  } 
  getStatusTooltip(enabled:boolean){
    return enabled?'Toggle to deactivate':'Toggle to activate';
  }
  searchAgents(shouldReset:boolean){
    if(this.searchFormControl.value != ""){
      if(shouldReset){
        this.searchPageNo = 0;
      }
      this.config["totalItems"] = 0;    
      this.config["currentPage"] = this.searchPageNo+1;
      this.config["itemsPerPage"] = this.pageSize;
      this.agents = [];
      this.isGettingAgents = true;
      this.isGettingAgentsSuccess = true;
      this.agentService.fetchAgentsBySearchTerm(this.searchFormControl.value,this.searchPageNo,this.pageSize).subscribe(res=>{
        this.isGettingAgents = false;
        if(res["success"]){
          this.config["totalItems"] = res["data"]["totalElements"];
          this.agents = res["data"]["content"];
        }else{  
          this.isGettingAgentsSuccess = false;
        }
      },error=>{
        this.showSnackbar("Connection Error",true,"close");
      });
    }
  }
  deleteAgent(event:any,agentId:string){
    const dialogRef = this.dialog.open(DeleteCommonComponent);    

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.agents = [];
        this.isGettingAgents = true;
        this.agentService.deleteAgent(agentId).subscribe(res=>{
            this.isGettingAgents = false;
            if(res["success"]){
              this.showSnackbar("Agent Deleted Successfully",true,"close");
              this.resetAll();
            }else{  
              this.showSnackbar("Server Error",true,"close");
            }
          },error=>{
            this.isGettingAgents = false;
            this.showSnackbar("Connection Error",true,"close");
          });
      }
    });    
  }
  onFilterChange(){
    this.activePageNo = 0;
    this.inactivePageNo = 0;
    this.getAgentsByFilter();
  }
  resetAll(){
    this.isSearchEnabled = false;
    this.activeFormControl.setValue("active");
    this.locationFormControl.setValue("");
    this.searchFormControl.setValue("");
    this.activePageNo = 0;
    this.inactivePageNo = 0;
    this.searchPageNo = 0;
    this.getAgentsByFilter();
  }
  goToVendors(agentId:string,agentDistrict:string){
    this.router.navigate(["/agents-vendors/"+agentId+"/"+agentDistrict]);
  }
  
  openAddAgent(){
    const dialogRef = this.dialog.open(AddAgentComponent,{});
    dialogRef.afterClosed().subscribe(result => {
      if(result){        
        this.showSnackbar("Agent added successfully!",true,"close");
        this.resetAll();
      }
    });      
  }

}
