import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetComponent } from './reset/reset.component';
import { MailComponent } from './forgot/mail/mail.component';
import { RegVerifyComponent } from './register/reg-verify/reg-verify.component';
import { VerifyComponent } from './forgot/verify/verify.component';
import { ResendVerifyComponent } from './login/resend-verify/resend-verify.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'reset', component: ResetComponent},
  { path: 'mail', component: MailComponent},
  { path: 'regVerify', component: RegVerifyComponent},
  { path: 'verify-user', component: VerifyComponent },
  { path: 'resend-verify', component: ResendVerifyComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
