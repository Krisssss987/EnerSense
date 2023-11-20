import { Component, HostListener } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  errorMessage!: string;
  hidePassword = true;
  hideConfirmPassword = true;
  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  contact = new FormControl('', [Validators.required]);
  location = new FormControl('', [Validators.required]);
  designation = new FormControl('', [Validators.required]);
  companyName = new FormControl('', [Validators.required]);
  companyEmail = new FormControl('', [Validators.required, Validators.email]);
  personalEmail = new FormControl('', [Validators.required, Validators.email]);
  confirmPassword = new FormControl('', [Validators.required, Validators.minLength(8)]);
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  loading: boolean = false;
  loadingMessage: string = "Sign Up";

  getCompanyEmailErrorMessage() {
    if (this.companyEmail.hasError('required')) {
      return 'Email is Required';
    }
    return this.companyEmail.hasError('email') ? 'Not a valid email' : '';
  }

  getPersonalEmailErrorMessage() {
    if (this.personalEmail.hasError('required')) {
      return 'Email is Required';
    }
    return this.personalEmail.hasError('email') ? 'Not a valid email' : '';
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

  isMobile: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenWidth();
  }

  ngOnInit() {
    // Call initially to set the initial value
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    this.isMobile = window.innerHeight <= 715;
  }

}
