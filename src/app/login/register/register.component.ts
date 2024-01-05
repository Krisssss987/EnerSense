import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  errorMessage!: string;
  hidePassword = true;
  hideConfirmPassword = true;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  companyName = new FormControl('', [Validators.required]);
  companyLocation = new FormControl('', [Validators.required]);
  companyEmail = new FormControl('', [Validators.required, Validators.email]);
  energy_consumer = new FormControl('lt', [Validators.required]);
  sanctioned_load = new FormControl('', [Validators.required]);
  contract_demand = new FormControl('', [Validators.required]);
  connected_load = new FormControl('', [Validators.required]);
  percent_demand = new FormControl('');
  bill = new FormControl('');
  tariff = new FormControl('', [Validators.required]);
  energy_detail = new FormControl('');
  energy_value = new FormControl('');
  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  contact = new FormControl('', [Validators.required]);
  plant = new FormControl('', [Validators.required]);
  designation = new FormControl('', [Validators.required]);
  personalEmail = new FormControl('', [Validators.required, Validators.email]);
  confirmPassword = new FormControl('', [Validators.required, Validators.minLength(8)]);
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  loading: boolean = false;
  loadingMessage: string = "Sign Up";

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private formBuilder: FormBuilder    
  ) {}

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

  submit(){

  }  
}
