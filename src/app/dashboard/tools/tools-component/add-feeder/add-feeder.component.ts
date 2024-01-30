import { Component, HostListener } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from 'src/app/dashboard/dash_service/dashboard.service';
import { AuthService } from 'src/app/login/auth/auth.service';

@Component({
  selector: 'app-add-feeder',
  templateUrl: './add-feeder.component.html',
  styleUrls: ['./add-feeder.component.css']
})
export class AddFeederComponent {

  feederName = new FormControl('', [Validators.required]);
  location = new FormControl('', [Validators.required]);
  threshold = new FormControl('', [Validators.required]);
  feederUid = new FormControl('', [Validators.required]);

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
    public dialogRef: MatDialogRef<AddFeederComponent>,
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
    if( this.feederName.valid && this.location.valid && this.threshold.valid && this.feederUid.valid )
    {
      const CompanyId = this.authService.getCompanyId();

      const feederData = {
        feederUid:this.feederUid.value,
        name:this.feederName.value, 
        location:this.location.value, 
        groupName:'', 
        virtualGroupName:'', 
        thresholdValue:this.threshold.value, 
        action:'', 
        companyId:CompanyId
      }

      this.DashDataService.deviceAdd(feederData).subscribe(
        (response) => {
          this.snackBar.open(
            'Feeder Added Successfully.',
            'Dismiss',
            { duration: 2000 }
          );
        },
        (error) => {
          this.snackBar.open(
            error.error.message || 'Registration failed. Please try again.',
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
