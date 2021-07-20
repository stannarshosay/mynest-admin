import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteNewsfeedComponent } from 'src/app/dialogs/delete-newsfeed/delete-newsfeed.component';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import moment from 'moment';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.css']
})
export class NewsfeedComponent implements OnInit {
  newsId:string = "";
  news:any = "";
  isNewsfeedDataSuccess = true;
  isNewsfeedLoaded = true;
  constructor(
    private route:ActivatedRoute,
    private newsfeedService:NewsfeedService,
    private router:Router,
    private dialog:MatDialog,
    private snackBar:MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.newsId = params.get('newsId'),
      this.getNewsfeedById()
    });
  }

  getNewsfeedById(){
    this.newsfeedService.getNewsfeedById(this.newsId).subscribe(res=>{
      this.isNewsfeedLoaded = false;
      if(res["success"]){
        this.news =res["data"];
      }else{
        this.isNewsfeedDataSuccess = false;
      }
    },
    error =>{
      this.isNewsfeedLoaded = false;
      this.isNewsfeedDataSuccess = false;
    });
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
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  deleteNewsfeed(){
    const dialogRef = this.dialog.open(DeleteNewsfeedComponent);    

    dialogRef.afterClosed().subscribe(result => {
      if(result){  
        this.news = "";     
        this.isNewsfeedDataSuccess = true;
        this.isNewsfeedLoaded = true;
        this.newsfeedService.deleteNewsfeedById(this.newsId).subscribe(res=>{
          if(res["success"]){
            this.showSnackbar("News Feed deleted successfully!",true,"close");
            this.router.navigateByUrl("/newsfeeds");
          }else{
            this.isNewsfeedLoaded = false;
            this.isNewsfeedDataSuccess = false;
            this.getNewsfeedById();
            this.showSnackbar("Deleting error!",true,"close");
          }
        },
        error =>{
          this.isNewsfeedLoaded = false;
          this.isNewsfeedDataSuccess = false;
          this.getNewsfeedById();
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
