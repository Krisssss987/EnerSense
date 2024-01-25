import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, combineLatest } from 'rxjs';
import { DashboardService } from 'src/app/dashboard/dash_service/dashboard.service';
import { AuthService } from 'src/app/login/auth/auth.service';

@Component({
  selector: 'app-add-shift',
  templateUrl: './add-shift.component.html',
  styleUrls: ['./add-shift.component.css']
})
export class AddShiftComponent implements OnInit,OnDestroy {

  shiftName = new FormControl('', [Validators.required]);
  startTime = new FormControl('', [Validators.required]);
  endTime = new FormControl('', [Validators.required]);
  timeDifference: string = '';

  private formSubscription!: Subscription;

  ngOnDestroy() {
    // Unsubscribe from the value changes when the component is destroyed
    this.formSubscription.unsubscribe();
  }

  private subscribeToFormChanges() {
    // CombineLatest allows us to react to changes in both controls
    return combineLatest([this.startTime.valueChanges, this.endTime.valueChanges])
      .subscribe(() => this.calculateTimeDifference());
  }

  calculateTimeDifference() {
    const startTimeValue = this.startTime.value as string;
    const endTimeValue = this.endTime.value as string;

    const startTimeArray = startTimeValue.split(':');
    const endTimeArray = endTimeValue.split(':');

    const startHours = parseInt(startTimeArray[0]);
    const startMinutes = parseInt(startTimeArray[1]);

    const endHours = parseInt(endTimeArray[0]);
    const endMinutes = parseInt(endTimeArray[1]);

    if((startHours>endHours) || (startHours==endHours && startMinutes>endMinutes)){
      const newStartHr = 24 - startHours;
      const newStartMin = 60 - startMinutes;

      const differenceInMinutes = (endHours * 60 + endMinutes) + (newStartHr * 60 + newStartMin);

      if (!isNaN(differenceInMinutes)) {
        const hours = Math.floor(differenceInMinutes / 60);
        const minutes = differenceInMinutes % 60;
        this.timeDifference = `${this.padZero(hours)}:${this.padZero(minutes)}`;
      } else {
        this.timeDifference = 'Invalid time values';
      }

    }else{
      const differenceInMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);

      if (!isNaN(differenceInMinutes)) {
        const hours = Math.floor(differenceInMinutes / 60);
        const minutes = differenceInMinutes % 60;
        this.timeDifference = `${this.padZero(hours)}:${this.padZero(minutes)}`;
      } else {
        this.timeDifference = 'Invalid time values';
      }
    }    
  }

  // Helper function to pad a number with a leading zero if needed
  private padZero(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }
  

  @HostListener('window:resize')
  onWindowResize() {
    this.adjustDialogWidth();
  }

  ngOnInit(): void {
    this.formSubscription = this.subscribeToFormChanges();
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
    if( this.shiftName.valid && this.startTime.valid && this.endTime.valid )
    {
      const CompanyId = this.authService.getCompanyId();

      const shiftData = {
        shiftCode:this.shiftName.value, 
        startTime:this.startTime.value, 
        endTime:this.endTime.value, 
        totalDuration:this.timeDifference,
        companyId:CompanyId
      }

      console.log(shiftData);

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
