import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AddNewsfeedComponent } from 'src/app/dialogs/add-newsfeed/add-newsfeed.component';
import { DeleteNewsfeedComponent } from 'src/app/dialogs/delete-newsfeed/delete-newsfeed.component';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import moment from 'moment';

@Component({
  selector: 'app-newsfeeds',
  templateUrl: './newsfeeds.component.html',
  styleUrls: ['./newsfeeds.component.css']
})
export class NewsfeedsComponent implements OnInit {
  config:any = {};
  newsfeeds:any[] = [];
  isGettingNewsfeedSuccess = false;
  isGettingNewsfeeds = true;
  pageNo:number = 0;
  pageSize:number = 9;
  constructor(
    private newsfeedService:NewsfeedService,
    public dialog:MatDialog,
    private snackBar:MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getNewsfeeds(this.pageNo,this.pageSize);
  }
  pageChange(newPage: number){
    this.pageNo = newPage-1;
    this.getNewsfeeds(this.pageNo,this.pageSize);
  } 
  getNewsfeeds(pageNo:any,pageSize:any){
    this.newsfeeds = [];
    this.config["totalItems"] = 0;
    this.isGettingNewsfeedSuccess = false;
    this.isGettingNewsfeeds = true;
    this.config["currentPage"] = pageNo+1;
    this.config["itemsPerPage"] = pageSize;    
    this.newsfeedService.getNewsfeeds(pageNo,pageSize).subscribe(res=>{
      this.isGettingNewsfeeds = false;
      if(res["success"]){
        this.newsfeeds =res["data"]["content"];
        this.config["totalItems"] = res["data"]["totalElements"];
      }else{
        this.isGettingNewsfeedSuccess = true;
      }
    },
    error =>{
      this.isGettingNewsfeeds = false;
      this.isGettingNewsfeedSuccess = true;
    });
  }
  checkLength(description:string){    
    if(description.length>120){
      return description.substring(0,120) +" ...";
    }
    return description;
 }
 getImagePath(image:any){
  if((image)&&(image!="")){
    return encodeURIComponent(image);
  }
  return encodeURIComponent("default.jpg");
  }
  getEncoded(data:any){
    return encodeURIComponent(data);
  }
  openAddNewsFeedDialog(){
    const dialogRef = this.dialog.open(AddNewsfeedComponent);    

    dialogRef.afterClosed().subscribe(result => {
      if(result){        
        this.showSnackbar("News Feed added successfully!",true,"close");
        this.pageNo = 0;
        this.getNewsfeeds(this.pageNo,this.pageSize);
      }
    });   
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  deleteNewsfeed(newsId:any,event:any){
    event.stopPropagation();
    const dialogRef = this.dialog.open(DeleteNewsfeedComponent);    

    dialogRef.afterClosed().subscribe(result => {
      if(result){       
        this.newsfeeds = [];
        this.isGettingNewsfeedSuccess = false;
        this.isGettingNewsfeeds = true; 
        this.newsfeedService.deleteNewsfeedById(newsId).subscribe(res=>{
          if(res["success"]){
            this.showSnackbar("News Feed deleted successfully!",true,"close");
            this.pageNo = 0;
            this.getNewsfeeds(this.pageNo,this.pageSize);
          }else{
            this.isGettingNewsfeeds = false;
            this.isGettingNewsfeedSuccess = true;
            this.showSnackbar("Deleting error!",true,"close");
          }
        },
        error =>{
          this.isGettingNewsfeeds = false;
          this.isGettingNewsfeedSuccess = true;
          this.showSnackbar("Connection error!",true,"close");
        });
      }
    }); 
  }
  getBeautifiedDate(dateString:string){
    let date = moment(dateString, "DD/MM/YYYY");
    if(date.isSame(moment(),'day')){
      return "Today";
    }
    if(date.isSame(moment().subtract(1,"days"),'day')){      
      return "Yesterday";
    }
    return date.format('Do MMM YYYY');
  }
}
