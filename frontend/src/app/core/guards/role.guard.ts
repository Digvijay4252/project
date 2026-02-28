import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as string[];
    const currentRole = this.authService.getUserRole();

    if (!allowedRoles || allowedRoles.includes(currentRole)) {
      return true;
    }

    const fallback = currentRole === 'ADMIN' ? '/admin' : currentRole === 'SELLER' ? '/seller' : '/user';
    this.router.navigate([fallback]);
    return false;
  }
}
