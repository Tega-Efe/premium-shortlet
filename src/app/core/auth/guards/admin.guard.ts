import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

/**
 * Admin route guard
 * Protects admin routes from unauthorized access
 */
export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AdminAuthService);
  const router = inject(Router);

  // Wait for auth state to initialize
  await authService.waitForAuthInit();

  // Check if user is authenticated
  if (authService.isLoggedIn()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  const returnUrl = state.url;
  
  // Redirect to login page with return URL
  router.navigate(['/admin/login'], {
    queryParams: { returnUrl }
  });

  return false;
};
