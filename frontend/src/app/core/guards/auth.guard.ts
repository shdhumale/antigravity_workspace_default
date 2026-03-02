import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const userRole = authService.currentUser()?.role;
    const expectedRole = route.data['role'];

    if (expectedRole) {
      const roles = ['VIEWER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'];
      const userLevel = roles.indexOf(userRole || '');
      const requiredLevel = roles.indexOf(expectedRole);

      if (userLevel < requiredLevel) {
        router.navigate(['/dashboard']);
        return false;
      }
    }
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
