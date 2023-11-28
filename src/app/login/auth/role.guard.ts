import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRoles: string[] = route.data['roles']; // Get the required roles from the route data

    const userType = this.authService.getUserType();
    if (userType !== null && requiredRoles.includes(userType)) {
      return true; // Allow access if the user has the required role
    }

    // Redirect to a different route or show an access denied page
    this.router.navigate(['/404']);
    return false;
  }
  
}
