import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { NavigationExtras, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent {
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  email = new FormControl('', [Validators.required, Validators.email]);
  errorMessage = '';
  loading:boolean = false;
  loadingMessage: string  = "Submit";
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email is required';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  submit(){
    if (this.email.valid) {
      this.loading = true;
      this.loadingMessage = "Submitting...";
      const forgotData = {
        personalEmail: this.email.value??'',
      };
      this.authService.forgot(forgotData).subscribe(
        () => {
          const personalEmail = forgotData.personalEmail;
          this.redirectToMailSend(personalEmail);//function to send email 
          this.sendEmail(personalEmail) ; // email send function 
          this.snackBar.open('Reset Password Link send successful!', 'Dismiss', {
            duration: 2000
          });
        },
        (error) => {
          this.snackBar.open(
            error.error.message || 'Failed to send Link. Please try again.',
            'Dismiss',
            { duration: 2000 }
          );
          this.errorMessage = error.error.message || '';
          this.loading = false;
          this.loadingMessage = "Submit";
        }
      );
    }
  }
  redirectToMailSend(personalEmail: string | null) {
    if (personalEmail) {
      const queryParams = {
        email: personalEmail  //  this function is used to navigate the user to a specific route
      };
      const navigationExtras: NavigationExtras = {
        queryParams: queryParams
      };
      this.router.navigate(['login'], navigationExtras);
    } else {
      console.error('Personal email is null');
    }
  }

    sendEmail(personalEmail: string) {
    const emailData = {
      to: personalEmail,
      subject: 'Password Reset',
      body: 'Your password reset link: <link_here>'
    };
  }
}
