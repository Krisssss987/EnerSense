import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetComponent } from './reset/reset.component';
import { ForgotComponent } from './forgot/forgot.component';
import { RegVerifyComponent } from './register/reg-verify/reg-verify.component';

import { MatCardModule } from '@angular/material/card';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { HttpClientModule } from '@angular/common/http';

import{ AuthService } from '../login/auth/auth.service';
import { ResendVerifyComponent } from './login/resend-verify/resend-verify.component';
import { VerifyComponent } from './forgot/verify/verify.component';
import { MailComponent } from './forgot/mail/mail.component';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [
    LoginLayoutComponent,
    LoginComponent,
    RegisterComponent,
    ResetComponent,
    ForgotComponent,
    RegVerifyComponent,
    ResendVerifyComponent,
    VerifyComponent,
    MailComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MatCardModule,
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatStepperModule,
    HttpClientModule,
    MatSnackBarModule,
    MatRadioModule
    
  ]
})
export class LoginModule { }
