// import { CanActivateFn } from '@angular/router';

// export const permissionGuard: CanActivateFn = (route, state) => {
//   return true;
// };
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

// permission.guard.ts
@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    const requiredModule = route.data['module'] || route.data['modules'];
    const requiredAction = route.data['action'] || 'read';

    if (!requiredModule) {
      return true; // No hay restricciones de permisos
    }

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    // soporte para array o string
  if (Array.isArray(requiredModule)) {
    const hasAccess = requiredModule.some(mod => this.authService.hasPermission(mod, requiredAction));
    if (!hasAccess) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }

    if (!this.authService.hasPermission(requiredModule, requiredAction)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}

