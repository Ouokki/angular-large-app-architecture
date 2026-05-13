import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService, type AppRole } from '../services/auth.service';

/**
 * Factory that returns a CanActivateFn checking for a specific role.
 *
 * Usage in routes:
 *   canActivate: [authGuard, roleGuard('admin')]
 *
 * Unauthenticated users are redirected to /login.
 * Authenticated users without the required role are redirected to /dashboard.
 */
export const roleGuard =
  (requiredRole: AppRole): CanActivateFn =>
  (_route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated()) {
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    if (auth.hasRole(requiredRole)) {
      return true;
    }

    return router.createUrlTree(['/dashboard']);
  };
