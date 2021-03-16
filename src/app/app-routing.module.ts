import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActiveRequirementsComponent } from './components/active-requirements/active-requirements.component';
import { AdSlotsComponent } from './components/ad-slots/ad-slots.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ClosedRequirementsComponent } from './components/closed-requirements/closed-requirements.component';
import { CustomerProfileComponent } from './components/customer-profile/customer-profile.component';
import { CustomersComponent } from './components/customers/customers.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeAdsComponent } from './components/home-ads/home-ads.component';
import { LoginComponent } from './components/login/login.component';
import { OverviewComponent } from './components/overview/overview.component';
import { PackagesComponent } from './components/packages/packages.component';
import { ReportedRequirementsComponent } from './components/reported-requirements/reported-requirements.component';
import { ReportedVendorsComponent } from './components/reported-vendors/reported-vendors.component';
import { RequestedAdsComponent } from './components/requested-ads/requested-ads.component';
import { VendorProfileComponent } from './components/vendor-profile/vendor-profile.component';
import { VendorsComponent } from './components/vendors/vendors.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  // {path:"dashboard",component:DashboardComponent},
  {path:"",redirectTo:"vendors",pathMatch:"full"},
  {path:"login",component:LoginComponent,canActivate:[LoginGuard]},
  {path:"vendors",component:VendorsComponent,canActivate:[AuthGuard]},
  {path:"vendor-profile/:vendorId",component:VendorProfileComponent,canActivate:[AuthGuard]},
  {path:"customer-profile/:customerId",component:CustomerProfileComponent,canActivate:[AuthGuard]},
  {path:"customers",component:CustomersComponent,canActivate:[AuthGuard]},
  {path:"packages",component:PackagesComponent,canActivate:[AuthGuard]},
  {path:"announcements",component:AnnouncementsComponent,canActivate:[AuthGuard]},
  {path:"categories",component:CategoriesComponent,canActivate:[AuthGuard]},
  {path:"home-ads",component:HomeAdsComponent,canActivate:[AuthGuard]},
  {path:"requested-ads",component:RequestedAdsComponent,canActivate:[AuthGuard]},
  {path:"manage-slots",component:AdSlotsComponent,canActivate:[AuthGuard]},
  {path:"reported-vendors",component:ReportedVendorsComponent,canActivate:[AuthGuard]},
  {path:"reported-requirements",component:ReportedRequirementsComponent,canActivate:[AuthGuard]},
  {path:"active-requirements",component:ActiveRequirementsComponent,canActivate:[AuthGuard]},
  {path:"closed-requirements",component:ClosedRequirementsComponent,canActivate:[AuthGuard]},
  {path:"overview",component:OverviewComponent,canActivate:[AuthGuard]},
  {path:"**",redirectTo:"vendors"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
