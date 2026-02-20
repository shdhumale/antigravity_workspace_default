import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Check role if needed
    const expectedRole = route.data['role'];
    if (expectedRole && authService.currentUser()?.role !== expectedRole && authService.currentUser()?.role !== 'SUPER_ADMIN') {
      router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
