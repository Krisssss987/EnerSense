import { Component, HostListener } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from 'src/app/dashboard/dash_service/dashboard.service';
import { AuthService } from 'src/app/authentication/auth/auth.service';

@Component({
  selector: 'app-add-alert',
  templateUrl: './add-alert.component.html',
  styleUrls: ['./add-alert.component.css']
})
export class AddAlertComponent {

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

  @HostListener('window:resize')
  onWindowResize() {
    this.adjustDialogWidth();
  }

  ngOnInit(): void {
    this.getFeeder();
    this.getUser(); 
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
    public dialogRef: MatDialogRef<AddAlertComponent>,
  ) {
    this.startTime.valueChanges.subscribe(() => {
      this.updateEndTimeMin();
    });
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
    if( this.feederName.valid && this.alertName.valid && this.parameter.valid && this.condition.valid && this.threshold.valid && this.repeat.valid && this.startTime.valid && this.endTime.valid && this.userName.valid && this.message.valid )
    {
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

      this.DashDataService.alertAdd(alertData).subscribe(
        (response) => {
          this.snackBar.open(
            'Alert Added Successfully.',
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
      this.snackBar.open('Error sending Feeder Data!', 'Dismiss', {
        duration: 2000
      });
    }    
  }

}
