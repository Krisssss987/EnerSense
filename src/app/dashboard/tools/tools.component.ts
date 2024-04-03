import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../dash_service/dashboard.service';
import { AuthService } from 'src/app/authentication/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddFeederComponent } from './tools-component/add-feeder/add-feeder.component';
import { AddUserComponent } from './tools-component/add-user/add-user.component';
import { AddShiftComponent } from './tools-component/add-shift/add-shift.component';
import { AddAlertComponent } from './tools-component/add-alert/add-alert.component';
import { UpdateFeederComponent } from './tools-component/update-feeder/update-feeder.component';
import { UpdateUserComponent } from './tools-component/update-user/update-user.component';
import { UpdateShiftComponent } from './tools-component/update-shift/update-shift.component';
import { UpdateAlertComponent } from './tools-component/update-alert/update-alert.component';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent {

  CompanyId!:string|null;
  feederData=new MatTableDataSource<any>(ELEMENT_DATA);
  userData=new MatTableDataSource<any>(ELEMENT_DATA);
  shiftData=new MatTableDataSource<any>(ELEMENT_DATA);
  alertData=new MatTableDataSource<any>(ELEMENT_DATA);
  value!: string;

  tabChanged(event: MatTabChangeEvent) {
    this.value = event.index.toString();
    sessionStorage.setItem('toolsTabIndex', this.value);
  }
  
  @ViewChild('userPaginator') userPaginator!: MatPaginator;
  @ViewChild('feederPaginator') feederPaginator!: MatPaginator;
  @ViewChild('alertPaginator') alertPaginator!: MatPaginator;
  @ViewChild('shiftPaginator') shiftPaginator!: MatPaginator;

  constructor(
    private DashDataService: DashboardService,
    private authService: AuthService,
    public snackBar: MatSnackBar,
    private dialog:MatDialog,
    private datePipe: DatePipe,
  ) {}
  
  ngOnInit() {
    this.privilegeSetup();
    this.getUserDevices();
    this.getUsers();
    this.getAlert();
    this.getShift();
    const storedValue = sessionStorage.getItem('toolsTabIndex');
      if (storedValue !== null) {
        this.value = storedValue;
      } else {
        this.value = '0';
    }
  }
  
  userColumns: string[] = ['usericon','name','email','designation','shift','contact','plant','privileges','action'];
  feederColumns: string[] = ['feederuid','name','location','action'];
  alertColumns: string[] = ['name','feedername','parameter','condition','threshold','repeat','start','end','sms','username','action'];
  shiftColumns: string[] = ['shiftcode','start','end','total','action'];
  userType! : string;

  privilegeSetup(){
    this.userType = this.authService.getUserType()??'';
    if(this.userType=="Standard"){
      this.userColumns = ['usericon','name','email','designation','shift','contact','plant','privileges'];
      this.feederColumns = ['feederuid','name','location'];
      this.alertColumns = ['name','feedername','parameter','condition','threshold','repeat','start','end','sms','username'];
      this.shiftColumns = ['shiftcode','start','end','total'];
    }
  }

  getUserDevices() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      this.DashDataService.deviceDetails(this.CompanyId).subscribe(
        (devices: any) => {
          this.feederData = new MatTableDataSource(devices.getFeederData);
          this.feederData.paginator = this.feederPaginator;
        },
        (error) => {
          this.snackBar.open('Error while fetching user devices!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  getUsers() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      this.DashDataService.userDetails(this.CompanyId).subscribe(
        (user: any) => {
          this.userData = new MatTableDataSource(user.getUser_Data);
          this.userData.paginator = this.userPaginator;
        },
        (error) => {
          this.snackBar.open('Error while fetching Users Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  getShift() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      this.DashDataService.shiftDetails(this.CompanyId).subscribe(
        (shift: any) => {
          this.shiftData = new MatTableDataSource(shift.getDay_Shift);
          this.shiftData.paginator = this.shiftPaginator;
        },
        (error) => {
          this.snackBar.open('Error while fetching Shifts Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  getAlert() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      this.DashDataService.alertDetails(this.CompanyId).subscribe(
        (alert: any) => {
          const dataSource2 = alert.getAlerts.map((alert: any) => {
            alert.formattedStartTime = this.datePipe.transform(alert.startTime, 'yyyy-MM-dd HH:mm');
            alert.formattedEndTime = this.datePipe.transform(alert.endTime, 'yyyy-MM-dd HH:mm');
            return alert;
          });
          
          this.alertData = new MatTableDataSource(dataSource2);
          this.alertData.paginator = this.alertPaginator;
        },
        (error) => {
          this.snackBar.open('Error while fetching Alert Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  openFeederDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.maxWidth = '90vw';
    const dialogRef = this.dialog.open(AddFeederComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(feederAdded => {
      setTimeout(() => {
        this.getUserDevices();
      }, 1000);
    });
  }

  openUserDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.maxWidth = '90vw';
    const dialogRef = this.dialog.open(AddUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(userAdded => {
      setTimeout(() => {
        this.getUsers();
      }, 1000);
    });
  }

  openShiftDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';
    const dialogRef = this.dialog.open(AddShiftComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(shiftAdded => {
      setTimeout(() => {
        this.getShift();
      }, 1000);
    });
  }

  openAlertDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';
    const dialogRef = this.dialog.open(AddAlertComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(alertAdded => {
      setTimeout(() => {
        this.getAlert();
      }, 1000);
    });
  }

  updateFeederDialog(element:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';
    dialogConfig.data = {feederData: element};
    const dialogRef = this.dialog.open(UpdateFeederComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(feederAdded => {
      setTimeout(() => {
        this.getUserDevices();
      }, 1000);
    });
  }

  UpdateUserDialog(element:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw'; 
    dialogConfig.data = {userData: element};
    const dialogRef = this.dialog.open(UpdateUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(userAdded => {
      setTimeout(() => {
        this.getUsers();
      }, 1000);
    });
  }

  updateShiftDialog(element:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';
    dialogConfig.data = {shiftData: element};
    const dialogRef = this.dialog.open(UpdateShiftComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(shiftAdded => {
      setTimeout(() => {
        this.getShift();
      }, 1000);
    });
  }

  updateAlertDialog(element:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';
    dialogConfig.data = {alertData: element};
    const dialogRef = this.dialog.open(UpdateAlertComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(alertAdded => {
      setTimeout(() => {
        this.getAlert();
      }, 1000);
    });
  }

  deleteUser(user: any) {
    const email = user.personalEmail;
  
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked 'Yes' in the confirmation dialog
        this.DashDataService.userDelete(email).subscribe(
          () => {
            // User deleted successfully
            Swal.fire({
              title: "Deleted!",
              text: "User has been deleted.",
              icon: "success",
              timer: 2000,
              timerProgressBar: true
            });
  
            this.getUsers();
          },
          (error) => {
            // Error deleting user
            console.error('Error deleting user:', error);
            Swal.fire({
              title: "Error",
              text: "Error deleting user",
              icon: "error",
              timer: 2000,
              timerProgressBar: true
            });
          }
        );
      }
    });
  }

  deleteDevice(device: any) {
    const deviceId = device.feederUid;
  
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.DashDataService.deviceDelete(deviceId).subscribe(
          () => {
            // User deleted successfully
            Swal.fire({
              title: "Deleted!",
              text: "Device has been deleted.",
              icon: "success",
              timer: 2000,
              timerProgressBar: true
            });
  
            this.getUserDevices();
          },
          (error) => {
            // Error deleting user
            console.error('Error deleting device:', error);
            Swal.fire({
              title: "Error",
              text: "Error deleting Device",
              icon: "error",
              timer: 2000,
              timerProgressBar: true
            });
          }
        );
      }
    });
  }

  deleteAlert(alert: any) {
    const alertId = alert.alertId;
  
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked 'Yes' in the confirmation dialog
        this.DashDataService.alertDelete(alertId).subscribe(
          () => {
            // User deleted successfully
            Swal.fire({
              title: "Deleted!",
              text: "Alert has been deleted.",
              icon: "success",
              timer: 2000,
              timerProgressBar: true
            });
  
            this.getAlert();
          },
          (error) => {
            // Error deleting user
            console.error('Error deleting Alert:', error);
            Swal.fire({
              title: "Error",
              text: "Error deleting Alert",
              icon: "error",
              timer: 2000,
              timerProgressBar: true
            });
          }
        );
      }
    });
  }

  deleteShift(shift: any) {
    const shiftId = shift.shiftCode;
  
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked 'Yes' in the confirmation dialog
        this.DashDataService.shiftDelete(shiftId).subscribe(
          () => {
            // User deleted successfully
            Swal.fire({
              title: "Deleted!",
              text: "Shift has been deleted.",
              icon: "success",
              timer: 2000,
              timerProgressBar: true
            });
  
            this.getShift();
          },
          (error) => {
            // Error deleting user
            console.error('Error deleting shift:', error);
            Swal.fire({
              title: "Error",
              text: "Error deleting shift",
              icon: "error",
              timer: 2000,
              timerProgressBar: true
            });
          }
        );
      }
    });
  }
}


const ELEMENT_DATA: any[] = [];
