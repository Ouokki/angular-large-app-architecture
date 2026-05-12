import { Route } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@angular-large-app/dashboard/feat-dashboard').then((m) => m.DashboardPageComponent),
    data: { preload: true },
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@angular-large-app/settings/feat-settings').then((m) => m.SettingsPageComponent),
    data: { preload: false },
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
