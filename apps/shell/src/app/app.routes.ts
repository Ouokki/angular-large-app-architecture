import { Route } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { loadRemoteModule } from '@nx/angular/mf';

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
    path: 'widgets',
    canActivate: [authGuard],
    // Remote failure falls back to a local error page so the shell stays usable
    // when remote-widgets is not deployed or the network is unavailable.
    loadChildren: () =>
      loadRemoteModule('remote-widgets', './Routes')
        .then((m) => m.remoteRoutes)
        .catch(() => import('./remote-error/remote-error.routes').then((m) => m.remoteErrorRoutes)),
    data: { preload: false },
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
