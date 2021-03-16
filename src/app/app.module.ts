import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//MAT imports
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatStepperModule} from '@angular/material/stepper';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatBadgeModule} from '@angular/material/badge';


import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AgmCoreModule } from '@agm/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VendorsComponent } from './components/vendors/vendors.component';
import { CustomersComponent } from './components/customers/customers.component';
import { OverviewComponent } from './components/overview/overview.component';
import { VendorProfileComponent } from './components/vendor-profile/vendor-profile.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { AddCategoryComponent } from './dialogs/add-category/add-category.component';
import { EditCategoryComponent } from './dialogs/edit-category/edit-category.component';
import { AddSubcategoryComponent } from './dialogs/add-subcategory/add-subcategory.component';
import { EditSubcategoryComponent } from './dialogs/edit-subcategory/edit-subcategory.component';
import { ReportedVendorsComponent } from './components/reported-vendors/reported-vendors.component';
import { SubscriptionStatusComponent } from './dialogs/subscription-status/subscription-status.component';
import { ReportedRequirementsComponent } from './components/reported-requirements/reported-requirements.component';
import { PackagesComponent } from './components/packages/packages.component';
import { EditPlanComponent } from './dialogs/edit-plan/edit-plan.component';
import { HomeAdsComponent } from './components/home-ads/home-ads.component';
import { RequestedAdsComponent } from './components/requested-ads/requested-ads.component';
import { AdSlotsComponent } from './components/ad-slots/ad-slots.component';
import { EditSlotPriceComponent } from './dialogs/edit-slot-price/edit-slot-price.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './dialogs/forgot-password/forgot-password.component';
import { NotificationsComponent } from './dialogs/notifications/notifications.component';
import { ClosedRequirementsComponent } from './components/closed-requirements/closed-requirements.component';
import { ActiveRequirementsComponent } from './components/active-requirements/active-requirements.component';
import { CustomerProfileComponent } from './components/customer-profile/customer-profile.component';
import { ChangePasswordComponent } from './dialogs/change-password/change-password.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { AddAnnouncementComponent } from './dialogs/add-announcement/add-announcement.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    VendorsComponent,
    CustomersComponent,
    OverviewComponent,
    VendorProfileComponent,
    CategoriesComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    AddSubcategoryComponent,
    EditSubcategoryComponent,
    ReportedVendorsComponent,
    SubscriptionStatusComponent,
    ReportedRequirementsComponent,
    PackagesComponent,
    EditPlanComponent,
    HomeAdsComponent,
    RequestedAdsComponent,
    AdSlotsComponent,
    EditSlotPriceComponent,
    LoginComponent,
    ForgotPasswordComponent,
    NotificationsComponent,
    ClosedRequirementsComponent,
    ActiveRequirementsComponent,
    CustomerProfileComponent,
    ChangePasswordComponent,
    AnnouncementsComponent,
    AddAnnouncementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatRadioModule,
    MatMenuModule,
    MatSelectModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatStepperModule,
    MatTooltipModule,
    MatBadgeModule,
    FlexLayoutModule,
    HttpClientModule,
    NgxPaginationModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCVBIT48KOxSsZLiRseEhGYlbB3DUw0NX4'
      /* apiKey is required, unless you are a
      premium customer, in which case you can
      use clientId
      */
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
