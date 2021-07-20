import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { BuisnessDetailsComponent } from 'src/app/dialogs/buisness-details/buisness-details.component';
import { SubscriptionStatusComponent } from 'src/app/dialogs/subscription-status/subscription-status.component';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {
  afterTooltip: TooltipPosition = "after";
  isGettingVendors: boolean = false;
  isGettingVendorsSuccess: boolean = true;
  isToggling: boolean = false;
  isActive: boolean = true;
  isSearchEnabled: boolean = false;
  activePageNo: number = 0;
  inactivePageNo: number = 0;
  searchPageNo: number = 0;
  pageSize: number = 10;
  config: any = {};
  activeFormControl = new FormControl("active");
  membershipFormControl = new FormControl();
  locationFormControl = new FormControl();
  searchFormControl = new FormControl();
  verifyFormControl = new FormControl();
  locations: any[] = [];
  plans: any[] = [];
  displayedColumns: string[] = ['id', 'logo', 'email', 'phone', 'companyname', 'registereddate', 'membership', 'profilestatus', 'verificationstatus', 'membershipdetails', 'buisnessdetails', 'toggleactivestatus'];
  vendors: any[] = [];
  constructor(
    private vendorService: VendorService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.activePageNo + 1;
    this.config["itemsPerPage"] = this.pageSize;
    this.getLocations();
  }
  showSnackbar(content: string, hasDuration: boolean, action: string) {
    const config = new MatSnackBarConfig();
    if (hasDuration) {
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  getLocations() {
    this.isGettingVendors = true;
    this.vendorService.getAllLocations().subscribe(res => {
      if (res["success"]) {
        this.locations = res["data"];
        this.getPlans();
      } else {
        this.showSnackbar("Location fetch server error", true, "close");
      }
    }, error => {
      this.showSnackbar("Location fetch connection error", true, "close");
    })
  }
  getPlans() {
    this.vendorService.getAllPlans().subscribe(res => {
      if (res["success"]) {
        this.plans = res["data"];
        this.getVendorsByFilter();
      } else {
        this.showSnackbar("Plans fetch server error", true, "close");
      }
    }, error => {
      this.showSnackbar("Plans fetch connection error", true, "close");
    })
  }
  getVendorsByFilter() {
    this.config["totalItems"] = 0;
    if (this.activeFormControl.value == "active") {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
    if (this.isActive) {
      this.config["currentPage"] = this.activePageNo + 1;
    } else {
      this.config["currentPage"] = this.inactivePageNo + 1;
    }
    this.config["itemsPerPage"] = this.pageSize;
    let paramData = {};
    paramData["isActive"] = this.isActive;
    if (this.membershipFormControl.value) {
      paramData["membershipName"] = this.membershipFormControl.value;
    }
    if (this.locationFormControl.value) {
      paramData["preferredLocation"] = this.locationFormControl.value;
    }
    if (this.verifyFormControl.value) {
      paramData["verified"] = this.verifyFormControl.value;
    }
    this.vendors = [];
    this.isGettingVendors = true;
    this.isGettingVendorsSuccess = true;
    this.vendorService.fetchVendorsByFilter(paramData, this.isActive ? this.activePageNo : this.inactivePageNo, this.pageSize).subscribe(res => {
      this.isGettingVendors = false;
      if (res["success"]) {
        this.config["totalItems"] = res["data"]["totalElements"];
        this.vendors = res["data"]["content"];
      } else {
        this.isGettingVendorsSuccess = false;
      }
    }, error => {
      this.showSnackbar("Connection Error", true, "close");
    });
  }
  getImagePath(image: any) {
    if ((image) && (image != "")) {
      return encodeURIComponent(image);
    } else {
      return encodeURIComponent("default.jpg");
    }
  }
  changeActiveStatus(event: any, vendorId: string, enabled: boolean) {
    this.isToggling = true;
    this.showSnackbar(enabled ? "Deactivating..." : "Activating...", false, "");
    let paramData = {};
    paramData["id"] = vendorId;
    paramData["enabled"] = !enabled;
    this.vendorService.toggleActiveStatus(paramData).subscribe(res => {
      this.isToggling = false;
      if (res["success"]) {
        this.showSnackbar(enabled ? "Deactivated successfully!" : "Activated successfully!", true, "close");
        if (this.isActive) {
          if ((this.vendors.length == 1) && (this.activePageNo != 0)) {
            this.activePageNo = this.activePageNo - 1;
          }
        }
        if (!this.isActive) {
          if ((this.vendors.length == 1) && (this.inactivePageNo != 0)) {
            this.inactivePageNo = this.inactivePageNo - 1;
          }
        }
        if (!this.isSearchEnabled) {
          this.getVendorsByFilter();
        }
      } else {
        event.source.checked = enabled;
        this.showSnackbar("Toggle status server error!", true, "close");
      }
    }, error => {
      this.isToggling = false;
      event.source.checked = enabled;
      this.showSnackbar("Toggle status connection error!", true, "close");
    });
  }
  pageChange(newPage: number) {
    if (this.isActive) {
      this.activePageNo = newPage - 1;
      this.getVendorsByFilter();
    }
    if (!this.isActive) {
      this.inactivePageNo = newPage - 1;
      this.getVendorsByFilter();
    }
    if (this.isSearchEnabled) {
      this.searchPageNo = newPage - 1;
      this.searchVendors(false);
    }
  }
  getStatusTooltip(enabled: boolean) {
    return enabled ? 'Toggle to deactivate' : 'Toggle to activate';
  }
  searchVendors(shouldReset: boolean) {
    if (this.searchFormControl.value != "") {
      if (shouldReset) {
        this.searchPageNo = 0;
      }
      this.config["totalItems"] = 0;
      this.config["currentPage"] = this.searchPageNo + 1;
      this.config["itemsPerPage"] = this.pageSize;
      this.vendors = [];
      this.isGettingVendors = true;
      this.isGettingVendorsSuccess = true;
      this.vendorService.fetchVendorsBySearchTerm(this.searchFormControl.value).subscribe(res => {
        this.isGettingVendors = false;
        if (res["success"]) {
          this.config["totalItems"] = res["data"]["totalElements"];
          this.vendors = res["data"]["content"];
        } else {
          this.isGettingVendorsSuccess = false;
        }
      }, error => {
        this.showSnackbar("Connection Error", true, "close");
      });
    }
  }
  onFilterChange() {
    this.activePageNo = 0;
    this.inactivePageNo = 0;
    this.getVendorsByFilter();
  }
  resetAll() {
    this.isSearchEnabled = false;
    this.activeFormControl.setValue("active");
    this.membershipFormControl.setValue("");
    this.locationFormControl.setValue("");
    this.searchFormControl.setValue("");
    this.verifyFormControl.setValue("");
    this.activePageNo = 0;
    this.inactivePageNo = 0;
    this.searchPageNo = 0;
    this.getVendorsByFilter();
  }
  goToVendorProfile(vendorId: string, profileStatus: string) {
    if (profileStatus == "COMPLETED") {
      this.router.navigate(["/vendor-profile/" + vendorId]);
    } else {
      this.showSnackbar("Profile not completed, can't view details!", true, "okay");
    }
  }
  viewSubscriptionDetails(vendorId: string, profileStatus: string) {
    if (profileStatus != "REGISTERED") {
      const dialogRef = this.dialog.open(SubscriptionStatusComponent, {
        data: {
          vendorId: vendorId
        }
      });
    } else {
      this.showSnackbar("Vendor has no plans subscribed!", true, "close");
    }
  }
  openVendorBuisnessDetails(vendorId: string, profileStatus: string) {
    if (profileStatus == "COMPLETED") {
      const dialogRef = this.dialog.open(BuisnessDetailsComponent, {
        data: vendorId
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log("dialog closed");
      });
    } else {
      this.showSnackbar("Profile not completed, can't view details!", true, "okay");
    }

  }
}
