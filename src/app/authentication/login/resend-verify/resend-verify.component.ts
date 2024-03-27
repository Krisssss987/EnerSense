import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-resend-verify',
  templateUrl: './resend-verify.component.html',
  styleUrls: ['./resend-verify.component.css']
})
export class ResendVerifyComponent {
  errorMessage!: string;
  loading: boolean = false;
  loadingMessage: string = "Sign Up";

  constructor(
    private authService:AuthService,
    private snackBar:MatSnackBar
  ){}

  email = new FormControl('', [Validators.required, Validators.email]);
  
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email is required';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  submit() {
    if (this.email.valid) {
      this.loading = true;
      this.loadingMessage = "Submitting...";

      const verificationData = {
        personalEmail: this.email.value,
      };

      this.authService.resendVerificationEmail(verificationData).subscribe(
        () => {
          this.snackBar.open('Verification mail sent successfully!', 'Dismiss', {
            duration: 2000
          });
        },
        (error) => {
          this.snackBar.open(
            error.error.message || 'Failed to send verification mail',
            'Dismiss',
            { duration: 2000 }
          );
          this.errorMessage = error.error.message || '';
          this.loading = false;
          this.loadingMessage = "Sign In";
        }
      );
    }
  }
}
