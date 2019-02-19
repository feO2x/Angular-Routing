import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, CanLoad, Route, UrlSegment } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  

  constructor(private authservice: AuthService,
              private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.checkIfUserIsLoggedIn(state.url);
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    return this.checkIfUserIsLoggedIn(route.path);
  }

  checkIfUserIsLoggedIn(url: string): boolean {
    if (this.authservice.isLoggedIn) {
      return true;
    }

    this.authservice.redirectUrl = url;
    this.router.navigate(['/login'])
    return false;
  }
}
