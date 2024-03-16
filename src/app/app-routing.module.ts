import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginLayoutComponent } from './authentication/login-layout/login-layout.component';
import { DashboardLayoutComponent } from './dashboard/dashboard-layout/dashboard-layout.component';
import { AuthGuard } from './authentication/auth/auth.guard';
import { LoginGuard } from './authentication/auth/login.guard';
import { RoleGuard } from './authentication/auth/role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginLayoutComponent,
    canActivate:[LoginGuard],
    children: [
      { path: '', loadChildren: () => import('./authentication/login.module').then(m => m.LoginModule) },
    ]
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate:[AuthGuard,RoleGuard],
    data: { roles: ['Standard', 'Admin'] },
    children: [
      { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
