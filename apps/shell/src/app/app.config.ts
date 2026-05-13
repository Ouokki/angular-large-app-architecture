import {
  ApplicationConfig,
  ErrorHandler,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { GlobalErrorHandler } from './error-handler/global-error-handler';
import {
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  withViewTransitions,
} from '@angular/router';
import { ConnectionAwarePreloadingStrategy } from './preloading/connection-aware-preload.strategy';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { retryInterceptor } from './interceptors/retry.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import {
  settingsReducer,
  SettingsEffects,
  SETTINGS_FEATURE_KEY,
} from '@angular-large-app/settings/data-access-settings';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withViewTransitions(),
      withPreloading(ConnectionAwarePreloadingStrategy),
    ),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor, retryInterceptor])),
    provideStore({ [SETTINGS_FEATURE_KEY]: settingsReducer }),
    provideEffects([SettingsEffects]),
    provideStoreDevtools({ maxAge: 25 }),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
