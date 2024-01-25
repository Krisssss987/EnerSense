import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../dash_service/dashboard.service';
import { AuthService } from 'src/app/login/auth/auth.service';
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
  }
  
  userColumns: string[] = ['usericon','name','email','designation','shift','contact','plant','privileges','action'];
  feederColumns: string[] = ['feederuid','name','location','group','groupname','threshold','action'];
  alertColumns: string[] = ['name','feedername','parameter','condition','threshold','repeat','start','end','sms','username','action'];
  shiftColumns: string[] = ['shiftcode','start','end','total','action'];
  userType! : string;

  privilegeSetup(){
    this.userType = this.authService.getUserType()??'';
    if(this.userType=="Standard"){
      this.userColumns = ['usericon','name','email','designation','shift','contact','plant','privileges'];
      this.feederColumns = ['feederuid','name','location','group','groupname','threshold'];
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
            alert.formattedStartTime = this.datePipe.transform(alert.startTime, 'yyyy-MM-dd HH:mm:ss');
            alert.formattedEndTime = this.datePipe.transform(alert.endTime, 'yyyy-MM-dd HH:mm:ss');
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
    dialogRef.afterClosed().subscribe(feederAdded => {});
  }

  openUserDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.maxWidth = '90vw';
    const dialogRef = this.dialog.open(AddUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(userAdded => {});
  }

  openShiftDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';
    const dialogRef = this.dialog.open(AddShiftComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(shiftAdded => {});
  }

  openAlertDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';
    const dialogRef = this.dialog.open(AddAlertComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(alertAdded => {});
  }

  updateFeederDialog(element:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';
    const dialogRef = this.dialog.open(UpdateFeederComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(feederAdded => {});
  }

  UpdateUserDialog(element:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';
    const dialogRef = this.dialog.open(UpdateUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(userAdded => {});
  }

  updateShiftDialog(element:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';
    const dialogRef = this.dialog.open(UpdateShiftComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(shiftAdded => {});
  }

  updateAlertDialog(element:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';
    const dialogRef = this.dialog.open(UpdateAlertComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(alertAdded => {});
  }
}


const ELEMENT_DATA: any[] = [];
