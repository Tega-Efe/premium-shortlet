import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

/**
 * Login Guard - Prevents authenticated users from accessing the login page
 * Redirects them to admin dashboard if already logged in
 */
export const loginGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AdminAuthService);
  const router = inject(Router);

  // Wait for auth initialization
  await authService.waitForAuthInit();

  // If already logged in, redirect to admin dashboard
  if (authService.isLoggedIn()) {
    console.log('🔒 Already authenticated - redirecting to admin dashboard');
    router.navigate(['/admin']);
    return false;
  }

  // Allow access to login page
  return true;
};
