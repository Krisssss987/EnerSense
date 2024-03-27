import { Component, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from '../../dash_service/dashboard.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/authentication/auth/auth.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {

  CompanyEmail!: string | null;
  selectedDevice!: string;
  selectedDeviceInterval: string ='';
  deviceOptions: any[] = [];
  CompanyId!: string | null;
  subscriptions: Subscription[] = [];

  @HostListener('window:resize')
  onWindowResize() {
    this.adjustDialogWidth();
  }

  constructor(
    private DashDataService: DashboardService,
    private authService: AuthService,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.adjustDialogWidth();
    this.getUserDevices();
    this.retrieveValues();
  }

  ngOnDestroy(){
    this.unsubscribeFromTopics();
  }
  
  unsubscribeFromTopics() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  retrieveValues(){
    this.selectedDevice = sessionStorage.getItem('deviceID')??'';
    this.selectedDeviceInterval = sessionStorage.getItem('interval')??'';
  }

  adjustDialogWidth() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 600) {
      this.dialogRef.updateSize('90%', '');
    } else if (screenWidth <= 960) {
      this.dialogRef.updateSize('70%', '');
    } else {
      this.dialogRef.updateSize('400px', '');
    }
  }

  getUserDevices() {
    this.CompanyId = this.authService.getCompanyId();
    if (this.CompanyId) {
      const subscription = this.DashDataService.deviceDetails(this.CompanyId).subscribe(
        (devices: any) => {
          this.deviceOptions = devices.getFeederData;
        },
        (error) => {
          this.snackBar.open('Error while fetching user devices!', 'Dismiss', {
            duration: 2000
          });
        }
      );
      this.subscriptions.push(subscription)
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.DashDataService.setDeviceId(this.selectedDevice);
    this.DashDataService.setInterval(this.selectedDeviceInterval);
    this.dialogRef.close();
  }
}
