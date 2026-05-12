import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { appRoutes } from './app.routes';
import {
  settingsReducer,
  SettingsEffects,
  SETTINGS_FEATURE_KEY,
} from '@angular-large-app/settings/data-access-settings';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(),
    provideStore({ [SETTINGS_FEATURE_KEY]: settingsReducer }),
    provideEffects([SettingsEffects]),
  ],
};
