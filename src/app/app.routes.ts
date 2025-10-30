import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/guards/admin.guard';
import { loginGuard } from './core/auth/guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./core/auth/pages/admin-login.component').then(m => m.AdminLoginComponent),
    canActivate: [loginGuard] // Prevent accessing login page when already logged in
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [adminGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
