import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetComponent } from './reset/reset.component';
import { ForgotComponent } from './forgot/forgot.component';
import { RegVerifyComponent } from './register/reg-verify/reg-verify.component';


@NgModule({
  declarations: [
    LoginLayoutComponent,
    LoginComponent,
    RegisterComponent,
    ResetComponent,
    ForgotComponent,
    RegVerifyComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
