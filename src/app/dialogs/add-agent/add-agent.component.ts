import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AgentService } from 'src/app/services/agent.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.css']
})
export class AddAgentComponent implements OnInit {
  isAdding:boolean = false;
  locations:any[] = [];
  agentForm:FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddAgentComponent>,
    private snackBar:MatSnackBar,
    private agentService:AgentService,
    private vendorService:VendorService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.agentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required,Validators.email]],
      mobile:['', [Validators.required,Validators.pattern("^[0-9]{10}$")]],
      location:['', Validators.required]
    });    
    this.getLocations();
  }
  getLocations(){    
    this.isAdding = true;
    this.vendorService.getAllLocations().subscribe(res=>{
      if(res["success"]){
        this.locations = res["data"];
        this.isAdding = false;
      }else{
        this.showSnackbar("Location fetch server error",true,"close");
      }
    },error=>{
      this.showSnackbar("Location fetch connection error",true,"close");
    })
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }  
  addAgent(){
      if(this.agentForm.valid){
        this.isAdding = true;
        this.showSnackbar("Please be patient! adding agent...",false,"");
        let paramData = this.agentForm.value;
        this.agentService.addAgent(paramData).subscribe(result => {
          this.isAdding = false;
          if(result["success"]){                 
            this.dialogRef.close(true);
          }else{
            this.showSnackbar(result["message"],true,"close");
          }
        },error=>{
            console.log(error);
            this.isAdding = false;
            this.showSnackbar("Connection Error!",true,"close");
        });
      }else{
        this.showSnackbar("Please fill all fields correctly!",true,"close");
      }
   
  }

}
