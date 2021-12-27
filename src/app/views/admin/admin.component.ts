import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { BrowserStorageService } from 'src/app/utility/browser-storage.service';
import { UtilityProvider } from 'src/app/utility/utility';
import{MediaObserver,MediaChange } from '@angular/flex-layout'
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { NavService } from 'src/app/services/menu/nav.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],

})
export class AdminComponent implements OnInit,OnDestroy {
  @ViewChild('appDrawer') appDrawer: ElementRef;
  isExpanded=false;
  UserName:any;
  UserID:any;
  UserEMailID:any;
  UserRoles:any;
  mediaSub:Subscription;
  deviceSx:boolean;
  navItems:any=[];
  constructor(public utilityProvider:UtilityProvider,
    public userService: UserService,
    public browserStorageService: BrowserStorageService,
    private router: Router,
    public mediaObserver:MediaObserver,
    public authService:AuthService,
    public navService: NavService
    ) { }
  

  ngOnInit(): void {
    this.mediaSub=this.mediaObserver.media$.subscribe((result:MediaChange)=>{
    this.deviceSx=(result.mqAlias=='xs');
    })
    this.UserName=this.browserStorageService.getLocalStorageItem('fullName');
    this.UserID=this.browserStorageService.getLocalStorageItem('userId');
    this.UserEMailID=this.browserStorageService.getLocalStorageItem('emailId');
    this.UserRoles=JSON.parse(this.browserStorageService.getSessionStorageItem('UserRoleNames'));    
   
    // if(!(this.userService.userRoles&& this.userService.userRoles.length>0)){
    //   this.getuserData().then((res)=>{
    //     console.log(this.userService.userRoles);
    //   });        
    
    // }else{
    //   console.log(this.userService.userRoles);
    // }
    
    let JsonData=JSON.stringify(this.userService.navMenuItems);
    var re = new RegExp('"Page":', 'g');
    JsonData = JsonData.replace(re, '"SubMenu":');
    this.navItems=JSON.parse(JsonData);
  }
  ngOnDestroy(): void {
    this.mediaSub.unsubscribe();
  }

  ExpandMenu(){
 this.isExpanded = !this.isExpanded;
 
}

LogOut(){
  // this.browserStorageService.clearLocalStorageItem();
  // this.browserStorageService.clearSessionStorage();
  // this.router.navigate(['auth/login/' + new Date().getTime()]);
  this.authService.logout();
}

getuserData(){
  return new Promise((resolve, reject) => {
      this.userService.getTritexUserDetails('RolePage',this.UserID).then(userData => {
        this.userService.userInfo = userData.result;
        this.browserStorageService.setLocalStorageItem('userId', userData.result.userModel.UserID);
        this.browserStorageService.setLocalStorageItem('emailId', userData.result.userModel.EmailID);
        this.browserStorageService.setLocalStorageItem('fullName',userData.result.userModel.FullName);
        this.userService.passChangeReq = userData.result.resetPassword;
        this.userService.navMenuItems = userData.result.menuModel;
        this.userService.userRoles = userData.result.userRole;
        this.browserStorageService.setSessionStorageItem('UserRoleNames',JSON.stringify(this.userService.userRoles));
        return resolve(true);
    });
  });
}

// isLargeScreen() {
//   const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
//   if (width > 720) {
//       return true;
//   } else {
//       return false;
//   }
// }


ngAfterViewInit() {
  this.navService.appDrawer = this.appDrawer;
}
}
