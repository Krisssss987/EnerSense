import { Component, HostListener } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from 'src/app/dashboard/dash_service/dashboard.service';
import { AuthService } from 'src/app/authentication/auth/auth.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  personalEmail = new FormControl('', [Validators.required, Validators.email]);
  designation = new FormControl('', [Validators.required]);
  contact = new FormControl('', [Validators.required]);
  plant = new FormControl('', [Validators.required]);
  shift = new FormControl('', [Validators.required]);
  privileges = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  confirmPassword = new FormControl('', [Validators.required]);
  shiftData:any;
  
  hidePassword = true;
  hideConfirmPassword = true;

  @HostListener('window:resize')
  onWindowResize() {
    this.adjustDialogWidth();
  }

  ngOnInit(): void {
    this.getShift();
  }

  constructor(
    private DashDataService: DashboardService,
    private authService: AuthService,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddUserComponent>,
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

  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Password is required';
    }
    return this.password.hasError('minlength')
      ? 'Password should be at least 8 characters long'
      : '';
  }

  getConfirmPasswordErrorMessage() {
    if (this.confirmPassword.hasError('required')) {
      return 'Password is required';
    }
    if (this.confirmPassword.hasError('minlength')) {
      return 'Password should be at least 8 characters long';
    }
    if (this.password.value !== this.confirmPassword.value) {
      return 'Passwords do not match';
    }
    return '';
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
    if(this.firstName.valid && this.lastName.valid && this.contact.valid && this.shift.valid && this.personalEmail.valid && this.password.valid && this.confirmPassword.valid && this.designation.valid && this.plant.valid && this.privileges.valid)
    {
      const CompanyName = this.authService.getCompanyName();

      const adminData = {
        firstName:this.firstName.value, 
        lastName:this.lastName.value, 
        companyName:CompanyName,
        contactno:this.contact.value, 
        shift:this.shift.value, 
        personalemail:this.personalEmail.value, 
        password:this.password.value, 
        designation:this.designation.value,  
        plant:this.plant.value, 
        privileges:this.privileges.value
      }

      this.DashDataService.userAdd(adminData).subscribe(
        (response) => {
          this.snackBar.open(
            'User Registered Successfully.',
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
      this.snackBar.open('Error sending Users Data!', 'Dismiss', {
        duration: 2000
      });
    }    
  }

}
