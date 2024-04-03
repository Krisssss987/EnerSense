import { Component, HostListener, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from 'src/app/dashboard/dash_service/dashboard.service';
import { AuthService } from 'src/app/authentication/auth/auth.service';

@Component({
  selector: 'app-update-feeder',
  templateUrl: './update-feeder.component.html',
  styleUrls: ['./update-feeder.component.css']
})
export class UpdateFeederComponent {

  feederData: any;

  feederName = new FormControl('', [Validators.required]);
  location = new FormControl('', [Validators.required]);
  feederUid = new FormControl('', [Validators.required]);

  @HostListener('window:resize')
  onWindowResize() {
    this.adjustDialogWidth();
  }

  ngOnInit(): void {
    this.previousData();
  }

  constructor(
    private DashDataService: DashboardService,
    private authService: AuthService,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UpdateFeederComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.feederData = data.feederData;
  }

  previousData(){
    this.feederName = new FormControl(`${this.feederData.name}`, [Validators.required]);
    this.location = new FormControl(`${this.feederData.location}`, [Validators.required]);
    this.feederUid = new FormControl(`${this.feederData.feederUid}`, [Validators.required]);
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
    if( this.feederName.valid && this.location.valid && this.feederUid.valid )
    {
      const feederId = this.feederData.feederId;

      const feederData = {
        feederUid:this.feederUid.value,
        name:this.feederName.value, 
        location:this.location.value,  
        thresholdValue:'', 
      }

      this.DashDataService.deviceUpdate(feederId,feederData).subscribe(
        (response) => {
          this.snackBar.open(
            'Feeder Updated Successfully.',
            'Dismiss',
            { duration: 2000 }
          );
        },
        (error) => {
          this.snackBar.open(
            error.error.message || 'Failed. Please try again.',
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
