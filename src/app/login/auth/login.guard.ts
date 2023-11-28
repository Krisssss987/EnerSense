import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}


  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // User is already logged in, redirect to the respective dashboard based on user type
      const userType = this.authService.getUserType();
      if (userType === 'Admin') {
        this.router.navigate(['/dashboard']);
      } else if (userType === 'Super Admin') {
        this.router.navigate(['/sa']);
      }
      return false; // Return false to prevent access to the login page
    }

    // User is not logged in, allow access to the login page
    return true;
  }
  
}