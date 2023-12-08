import { Component, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../login/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from '../../dash_service/dashboard.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {

  public disabled = false;
  public showSpinners = true;
  public showSeconds = true;
  public touchUi = false;
  public enableMeridian = false;
  public minDate!: Date;
  public maxDate!: Date;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public disableMinute = false;
  public hideTime = false;

  CompanyEmail!: string | null;
  selectedDevice!: FormControl;
  selectedDeviceInterval!: FormControl;
  deviceOptions: any[] = [];
  selectedRadioButton: string = 'Last';
  currentDate: Date = new Date();
  startDate!: Date;
  endDate: Date = this.currentDate;
  start_date = new FormControl('', [Validators.required]);
  end_date = new FormControl('', [Validators.required]);
  CompanyId!: string | null;

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
  }

  updateStartDate(event: any): void {
    const selectedStartDate = event.value;
    this.startDate = selectedStartDate;
  }

  updateEndDate(event: any): void {
    const selectedEndDate = event.value;
    if (!this.startDate || selectedEndDate >= this.startDate) {
      this.endDate = selectedEndDate;
    } else {
      this.endDate = this.currentDate;
      console.error('End date must be greater than or equal to the start date');
    }
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
    console.log(this.CompanyId);
    if (this.CompanyId) {
      this.DashDataService.deviceDetails(this.CompanyId).subscribe(
        (devices: any) => {
          this.deviceOptions = devices;
          console.log(this.deviceOptions);
        },
        (error) => {
          this.snackBar.open('Error while fetching user devices!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    // if (this.selectedRadioButton === 'Last') {
    //   if (this.selectedDevice.value) {
    //     const device = this.selectedDevice.value;
    //     const interval = this.selectedDeviceInterval.value;

    //     this.DashDataService.dataLast(device, interval).subscribe(
    //       (resultData: any) => {
    //         const data = resultData;
    //         this.DashDataService.dataLastStatus(device, interval).subscribe(
    //           (resultDataStatus: any) => {
    //             const dataStatus = resultDataStatus;
    //             this.dialogRef.close({ data, dataStatus, device });
    //           },
    //           (error) => {
    //             this.snackBar.open('Error while fetching last data status!', 'Dismiss', {
    //               duration: 2000
    //             });
    //           }
    //         );
    //       },
    //       (error) => {
    //         this.snackBar.open('Error while fetching last data!', 'Dismiss', {
    //           duration: 2000
    //         });
    //       }
    //     );
    //   } else {
    //     this.snackBar.open('No device has been selected!', 'Dismiss', {
    //       duration: 2000
    //     });
    //   }
    // } else if (this.selectedRadioButton === 'timePeriod') {
    //   if (this.selectedDevice.value) {
    //     const device = this.selectedDevice.value;
    //     const formattedStartDate = this.startDate.toISOString().split('T')[0];
    //     const formattedEndDate = this.endDate.toISOString().split('T')[0];

    //     this.DashDataService.DataByCustomDate(device, formattedStartDate, formattedEndDate).subscribe(
    //       (resultData: any) => {
    //         const data = resultData;
    //         this.DashDataService.DataByCustomDateStatus(device, formattedStartDate, formattedEndDate).subscribe(
    //           (resultDataStatus: any) => {
    //             const dataStatus = resultDataStatus;
    //             this.dialogRef.close({ data, dataStatus, device });
    //           },
    //           (error) => {
    //             this.snackBar.open('Error while fetching data status by custom date!', 'Dismiss', {
    //               duration: 2000
    //             });
    //           }
    //         );
    //       },
    //       (error) => {
    //         this.snackBar.open('Error while fetching data by custom date!', 'Dismiss', {
    //           duration: 2000
    //         });
    //       }
    //     );
    //   } else {
    //     this.snackBar.open('No device has been selected!', 'Dismiss', {
    //       duration: 2000
    //     });
    //   }
    // }
  }
}
