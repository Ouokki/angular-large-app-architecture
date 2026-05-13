import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingsState } from './settings.reducer';

export const SETTINGS_FEATURE_KEY = 'settings';

export const selectSettingsState = createFeatureSelector<SettingsState>(SETTINGS_FEATURE_KEY);

export const selectSettings = createSelector(selectSettingsState, (s) => s.settings);
export const selectTheme = createSelector(selectSettings, (s) => s.theme);
export const selectNotifications = createSelector(selectSettings, (s) => s.notifications);
export const selectLoading = createSelector(selectSettingsState, (s) => s.loading);
export const selectSaving = createSelector(selectSettingsState, (s) => s.saving);
export const selectError = createSelector(selectSettingsState, (s) => s.error);
export const selectLastSaved = createSelector(selectSettingsState, (s) => s.lastSaved);

// Used internally by effects to retrieve previousSettings for rollback dispatch
export const selectPreviousSettings = createSelector(
  selectSettingsState,
  (s) => s.previousSettings,
);
