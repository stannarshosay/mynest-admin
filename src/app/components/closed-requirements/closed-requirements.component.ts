import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { RequirementService } from 'src/app/services/requirement.service';

@Component({
  selector: 'app-closed-requirements',
  templateUrl: './closed-requirements.component.html',
  styleUrls: ['./closed-requirements.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ClosedRequirementsComponent implements OnInit {
  beforeTooltip:TooltipPosition = "before";
  isGettingRequirements:boolean = false;
  isGettingRequirementsSuccess:boolean = true;
  isSettingStatus:boolean = false;
  requirements:any[] = [];
  displayedColumns: string[] = ['requirementid','customer','reason','locations','createddate'];
  pageNo:number = 0;
  pageSize:number = 10;
  config:any = {};
  constructor(
    private requirementService:RequirementService,
    private snackBar:MatSnackBar,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.pageNo+1;
    this.config["itemsPerPage"] = this.pageSize;
    this.getClosedRequirements();
    this.showSnackbar("Click on rows to view full details",true,"okay");
  }
  pageChange(newPage: number){
      this.pageNo = newPage-1;
      this.getClosedRequirements();
  } 
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  getClosedRequirements(){
    this.config["totalItems"] = 0;    
    this.config["currentPage"] = this.pageNo+1;    
    this.config["itemsPerPage"] = this.pageSize;
    this.requirements = [];
    this.isGettingRequirements = true;
    this.isGettingRequirementsSuccess = true;
    this.requirementService.fetchAllRequirements("CLOSED",this.pageNo,this.pageSize).subscribe(res=>{
      this.isGettingRequirements = false;
      if(res["success"]){
        this.config["totalItems"] = res["data"]["totalElements"];
        this.requirements = res["data"]["content"];   
      }else{     
        this.isGettingRequirementsSuccess = false;
      }
    },error=>{
      this.showSnackbar("Connection Error",true,"close");
    });
  }
  goToCustomerProfile(customerId:string){
    this.router.navigate(["/customer-profile/"+customerId]);
  } 
  getEncodedString(path:string){
    return encodeURIComponent(path);
  }


}
