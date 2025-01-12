import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';

export const AuthGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const currentUser = authService.currentUserValue;

  if (!currentUser) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRoles: string[] = route.data['roles'] || [];
  if (requiredRoles.length && (!currentUser.roles || !currentUser.roles.some(role => requiredRoles.includes(role)))) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
