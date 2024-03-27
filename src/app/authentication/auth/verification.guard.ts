import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VerificationGuard implements CanActivate {
  constructor(private router: Router,
    private authService:AuthService) {}

    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<boolean> {
      return this.authService.errorMessage$.pipe(
        map(errorMessage => {
          if (errorMessage === 'User is not verified. Please verify your account.') {
            return true;
          } else {
            this.router.navigate(['/login']);
            return false;
          }
        })
      );
    }
}
