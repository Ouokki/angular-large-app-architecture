import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  withViewTransitions,
} from '@angular/router';
import { SelectivePreloadStrategy } from './preloading/selective-preload.strategy';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
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
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withViewTransitions(),
      withPreloading(SelectivePreloadStrategy),
    ),
    provideAnimations(),
    provideHttpClient(),
    provideStore({ [SETTINGS_FEATURE_KEY]: settingsReducer }),
    provideEffects([SettingsEffects]),
  ],
};
