import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-resend-verify',
  templateUrl: './resend-verify.component.html',
  styleUrls: ['./resend-verify.component.css']
})
export class ResendVerifyComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email is required';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
}
