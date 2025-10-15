import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const nonAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAdmin() && authService.isAuthenticated()) {
    return true;
  }

  router.navigateByUrl('/home');
  return false;
};



