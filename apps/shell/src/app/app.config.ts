import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { GlobalErrorHandler } from './error-handler/global-error-handler';
import {
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  withViewTransitions,
} from '@angular/router';
import { ConnectionAwarePreloadingStrategy } from './preloading/connection-aware-preload.strategy';
import { provideHttpClient } from '@angular/common/http';
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
    provideHttpClient(),
    provideStore({ [SETTINGS_FEATURE_KEY]: settingsReducer }),
    provideEffects([SettingsEffects]),
    provideStoreDevtools({ maxAge: 25 }),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
