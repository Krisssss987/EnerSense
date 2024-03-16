import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reg-verify',
  templateUrl: './reg-verify.component.html',
  styleUrls: ['./reg-verify.component.css']
})
export class RegVerifyComponent  implements OnInit {
  personalEmail!: string;
  counter = 10;
  showResendLink = false;
  linkClicked = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.personalEmail = params['personalEmail'];
    });
    this.startCounter();
  }

  resendVerificationEmail() {
    const resendVerifyData = {
      personalEmail: this.personalEmail
    };

    if (!this.linkClicked) {
      // Call the API to resend verification email
      this.authService.resendVerificationEmail(resendVerifyData).subscribe(
        (response) => {
          this.snackBar.open('Resend Successfully!', 'Dismiss', {
            duration: 2000
          });
        },
        (error) => {
          this.snackBar.open('Token not found', 'Dismiss', {
            duration: 2000
          });
          // Handle error, if needed
        }
      );
      this.linkClicked = true;

      // Redirect to the login page
      this.router.navigate(['/login']);
    }
  }

  startCounter() {
    const interval = setInterval(() => {
      this.counter--;
      if (this.counter <= 0) {
        clearInterval(interval);
        this.showResendLink = true;
      }
    }, 1000);
  }
}
