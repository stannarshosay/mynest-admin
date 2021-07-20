import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-buisness-details',
  templateUrl: './buisness-details.component.html',
  styleUrls: ['./buisness-details.component.css']
})
export class BuisnessDetailsComponent implements OnInit {
  isGetting:boolean = true;
  details:any[] = [];
  displayedColumns: string[] = ['premium','gold','silver','bronze','booked','running','expired'];
  constructor(
    public dialogRef: MatDialogRef<BuisnessDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private snackBar:MatSnackBar,
    private agentService:AgentService,
  ) { }

  ngOnInit(): void {
    this.getDetails();
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  } 
  getDetails(){
      this.agentService.getDetailsByVendorId(this.data).subscribe(res=>{
          this.isGetting = false;
          if(res["success"]){
            this.details.push(res["data"]); 
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
      },error=>{  
        this.isGetting = false;       
        this.showSnackbar("Connection error!",true,"close");
    });
  }
}
