import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  const isLoggedIn:boolean = this.authService.isLoggedIn();
  const storedToken:string | null= sessionStorage.getItem('token');

  if (isLoggedIn && storedToken) {
    const tokenMatches = storedToken === this.authService.getToken();
    if (tokenMatches) {
      return true;
    } else {
      this.router.navigate(['/access-denied']);
      return false;
    }
  } else {
    this.router.navigate(['/login/login']);
    return false;
  }
}
}
