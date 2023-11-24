import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent {
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}
  hide = true;
  hide2 = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  newPassword = new FormControl('', [Validators.required, Validators.minLength(8)]); // Adjust the validation as needed
  confirmPassword = new FormControl('', [Validators.required, Validators.minLength(8)]);

  errorMessage = '';
  loading:boolean = false;
  loadingMessage: string  = "Submit";

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email is required';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  getNewPasswordErrorMessage() {
    // Add your new password validation error messages
    if (this.newPassword.hasError('required')) {
      return 'New Password is required';
    }
    return this.newPassword.hasError('minlength') ? 'Password must be at least 8 characters' : '';
  }

  getConfirmPasswordErrorMessage() {
    // Add your confirm password validation error messages
    if (this.confirmPassword.hasError('required')) {
      return 'Confirm Password is required';
    }
    return this.confirmPassword.hasError('minlength') ? 'Password must be at least 8 characters' : '';
  }
  resetPassword() {
    // Implement the logic to handle password reset here
    // You can use this.email.value, this.newPassword.value, and this.confirmPassword.value
    // to get the values from the form controls
  }
}