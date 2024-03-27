import { Component, HostListener, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from 'src/app/dashboard/dash_service/dashboard.service';
import { AuthService } from 'src/app/authentication/auth/auth.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent {

  userData:any;

  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  personalEmail = new FormControl('', [Validators.required]);
  designation = new FormControl('', [Validators.required]);
  contact = new FormControl('', [Validators.required]);
  plant = new FormControl('', [Validators.required]);
  shift = new FormControl('', [Validators.required]);
  privileges = new FormControl('', [Validators.required]);
  shiftData:any;
  
  hidePassword = true;
  hideConfirmPassword = true;

  @HostListener('window:resize')
  onWindowResize() {
    this.adjustDialogWidth();
  }

  ngOnInit(): void {
    this.getShift();
    this.previousData();
    
  }

  constructor(
    private DashDataService: DashboardService,
    private authService: AuthService,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.userData = data.userData;
  }

  previousData(){
    this.firstName = new FormControl(`${this.userData.firstName}`, [Validators.required]);
    this.lastName = new FormControl(`${this.userData.lastName}`, [Validators.required]);
    this.personalEmail = new FormControl(`${this.userData.personalEmail}`, [Validators.required]);
    this.designation = new FormControl(`${this.userData.designation}`, [Validators.required]);
    this.contact = new FormControl(`${this.userData.contactNo}`, [Validators.required]);
    this.plant = new FormControl(`${this.userData.plant}`, [Validators.required]);
    this.shift = new FormControl(`${this.userData.shift}`, [Validators.required]);
    this.privileges = new FormControl(`${this.userData.privileges}`, [Validators.required]);
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

  getShift() {
    const CompanyId = this.authService.getCompanyId();
    if (CompanyId) {
      this.DashDataService.shiftDetails(CompanyId).subscribe(
        (shift: any) => {
          this.shiftData = shift.getDay_Shift;
        },
        (error) => {
          this.snackBar.open('Error while fetching Shifts Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  onNoClick(){
    this.dialogRef.close();
  }

  onSaveClick(){
    if(this.firstName.valid && this.lastName.valid && this.contact.valid && this.shift.valid && this.personalEmail.valid && this.designation.valid && this.plant.valid && this.privileges.valid)
    {
      const personalEmail = this.userData.personalEmail;

      const adminData = {
        userName:this.personalEmail.value,
        firstName:this.firstName.value, 
        lastName:this.lastName.value,
        contactNo:this.contact.value, 
        shift:this.shift.value, 
        designation:this.designation.value,  
        plant:this.plant.value, 
        privileges:this.privileges.value
      }

      this.DashDataService.userUpdate(personalEmail,adminData).subscribe(
        (response) => {
          this.snackBar.open(
            'User data Updated Successfully.',
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
      this.snackBar.open('Error sending Users Data!', 'Dismiss', {
        duration: 2000
      });
    }    
  }

}

