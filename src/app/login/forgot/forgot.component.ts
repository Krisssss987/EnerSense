import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
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

}
