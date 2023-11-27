import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit{
  personalEmail!: string;
  counter = 10;
  showResendLink = false;
  linkClicked = false;
  interval: any; // Variable to store the interval

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

  resendResetPasswordEmail() {
    const resendforgotData = {
      personalEmail: this.personalEmail
    };

    if (!this.linkClicked) {
      this.linkClicked = true;

      // Call the API to resend the verification email
      this.authService.resendForgot(resendforgotData).subscribe(
        (response) => {
          this.snackBar.open('Resend Successful!', 'Dismiss', {
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

      this.resetCounter();
    }
  }

  startCounter() {
    this.interval = setInterval(() => {
      this.counter--;
      if (this.counter <= 0) {
        clearInterval(this.interval);
        this.showResendLink = true;
      }
    }, 1000);
  }

  resetCounter() {
    clearInterval(this.interval);
    this.showResendLink = false;
    this.counter = 10;
    this.linkClicked = false;
    this.startCounter();
  }
}
