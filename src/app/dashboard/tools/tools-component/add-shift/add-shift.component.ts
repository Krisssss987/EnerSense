import { Component, HostListener } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from 'src/app/dashboard/dash_service/dashboard.service';
import { AuthService } from 'src/app/login/auth/auth.service';

@Component({
  selector: 'app-add-shift',
  templateUrl: './add-shift.component.html',
  styleUrls: ['./add-shift.component.css']
})
export class AddShiftComponent {

  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public disableMinute = false;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;

  shiftName = new FormControl('', [Validators.required]);
  startTime = new FormControl('', [Validators.required]);
  endTime = new FormControl('', [Validators.required]);

  @HostListener('window:resize')
  onWindowResize() {
    this.adjustDialogWidth();
  }

  ngOnInit(): void {
    
  }

  constructor(
    private DashDataService: DashboardService,
    private authService: AuthService,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddShiftComponent>,
  ) {}

  
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
    if( this.endTime.valid && this.startTime.valid && this.shiftName.valid )
    {
      const CompanyId = this.authService.getCompanyId();

      const shiftData = {
        // feederUid:this.feederUid.value,
        // name:this.feederName.value, 
        // location:this.location.value, 
        // groupName:'', 
        // virtualGroupName:'', 
        // thresholdValue:this.threshold.value, 
        // action:'', 
        // companyId:CompanyId
      }

      this.DashDataService.shiftAdd(shiftData).subscribe(
        (response) => {
          this.snackBar.open(
            'Shift Added Successfully.',
            'Dismiss',
            { duration: 2000 }
          );
          window.location.reload();
        },
        (error) => {
          this.snackBar.open(
            error.error.message || 'Failed! Please try again.',
            'Dismiss',
            { duration: 2000 }
          );
        }
      );

    this.dialogRef.close();
    }else{
      this.snackBar.open('Error sending Shift Data!', 'Dismiss', {
        duration: 2000
      });
    }    
  }
  
}
