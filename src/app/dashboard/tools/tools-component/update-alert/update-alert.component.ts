import { DatePipe } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from 'src/app/dashboard/dash_service/dashboard.service';
import { AuthService } from 'src/app/authentication/auth/auth.service';

@Component({
  selector: 'app-update-alert',
  templateUrl: './update-alert.component.html',
  styleUrls: ['./update-alert.component.css']
})
export class UpdateAlertComponent {

  alertData:any;

  alertName = new FormControl('', [Validators.required]);
  feederName = new FormControl('', [Validators.required]);
  parameter = new FormControl('', [Validators.required]);
  condition = new FormControl('', [Validators.required]);
  threshold = new FormControl('', [Validators.required]);
  repeat = new FormControl('', [Validators.required]);
  startTime = new FormControl('', [Validators.required]);
  endTime = new FormControl('', [Validators.required]);
  userName = new FormControl('', [Validators.required]);
  message = new FormControl('', [Validators.required]);
  userData: any;
  feederData: any;

  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public disableMinute = false;
  public hideTime = false;
  prevStart!: string | null;
  prevEnd!: string | null;

  @HostListener('window:resize')
  onWindowResize() {
    this.adjustDialogWidth();
  }

  ngOnInit(): void {
    this.getFeeder();
    this.getUser(); 
    this.previousData();
  }

  minEndTime!: Date;

  updateEndTimeMin() {
    const startValue = this.startTime.value;

    if (startValue) {
      this.minEndTime = new Date(startValue);
    }
  }

  getFeeder() {
    const CompanyId = this.authService.getCompanyId();
    if (CompanyId) {
      this.DashDataService.deviceDetails(CompanyId).subscribe(
        (feeder: any) => {
          this.feederData = feeder.getFeederData;
        },
        (error) => {
          this.snackBar.open('Error while fetching Feeders Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  getUser() {
    const CompanyId = this.authService.getCompanyId();
    if (CompanyId) {
      this.DashDataService.userDetails(CompanyId).subscribe(
        (user: any) => {
          this.userData = user.getUser_Data;
        },
        (error) => {
          this.snackBar.open('Error while fetching Users Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  constructor(
    private DashDataService: DashboardService,
    private authService: AuthService,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<UpdateAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.alertData = data.alertData;
      console.log(this.alertData);
    this.startTime.valueChanges.subscribe(() => {
      this.updateEndTimeMin();
    });
  }

  previousData(){
    this.alertName = new FormControl(`${this.alertData.name}`, [Validators.required]);
    this.feederName = new FormControl(`${this.alertData.feederName}`, [Validators.required]);
    this.parameter = new FormControl(`${this.alertData.parameter}`, [Validators.required]);
    this.condition = new FormControl(`${this.alertData.condition}`, [Validators.required]);
    this.threshold = new FormControl(`${this.alertData.threshold}`, [Validators.required]);
    this.repeat = new FormControl(`${this.alertData.repeat}`, [Validators.required]);
    this.startTime = new FormControl(`${this.alertData.startTime}`, [Validators.required]);
    this.endTime = new FormControl(`${this.alertData.endTime}`, [Validators.required]);
    this.userName = new FormControl(`${this.alertData.userName}`, [Validators.required]);
    this.message = new FormControl(`${this.alertData.message}`, [Validators.required]);

    this.updateEndTimeMin();
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

  onNoClick(){
    this.dialogRef.close();
  }

  onSaveClick(){
    if( this.feederName.valid && this.alertName.valid && this.parameter.valid && this.condition.valid && this.threshold.valid && this.repeat.valid && this.userName.valid && this.message.valid )
    {
      const alertId = this.alertData.alertId;

      const CompanyId = this.authService.getCompanyId();

      const alertData = {
        name : this.alertName.value, 
        feederName :this.feederName.value, 
        parameter :this.parameter.value, 
        condition :this.condition.value, 
        threshold :this.threshold.value, 
        repeat :this.repeat.value, 
        startTime:this.startTime.value , 
        endTime: this.endTime.value, 
        message :this.message.value, 
        userName :this.userName.value,
        companyId:CompanyId
      }

      this.DashDataService.alertUpdate(alertId,alertData).subscribe(
        (response) => {
          this.snackBar.open(
            'Alert Updated Successfully.',
            'Dismiss',
            { duration: 2000 }
          );
        },
        (error) => {
          this.snackBar.open(
            error.error.message || 'Failed!. Please try again.',
            'Dismiss',
            { duration: 2000 }
          );
        }
      );

    this.dialogRef.close();
    }else{
      this.snackBar.open('Error sending Data!', 'Dismiss', {
        duration: 2000
      });
    }    
  }

}
