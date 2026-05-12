import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingsState } from './settings.reducer';

export const SETTINGS_FEATURE_KEY = 'settings';

export const selectSettingsState = createFeatureSelector<SettingsState>(SETTINGS_FEATURE_KEY);

export const selectSettings = createSelector(selectSettingsState, (s) => s.settings);

export const selectTheme = createSelector(selectSettings, (s) => s.theme);

export const selectLanguage = createSelector(selectSettings, (s) => s.language);

export const selectNotificationsEnabled = createSelector(
  selectSettings,
  (s) => s.notificationsEnabled,
);

export const selectCompactMode = createSelector(selectSettings, (s) => s.compactMode);

export const selectSettingsLoading = createSelector(selectSettingsState, (s) => s.loading);

export const selectSettingsError = createSelector(selectSettingsState, (s) => s.error);

export const selectSettingsDirty = createSelector(selectSettingsState, (s) => s.dirty);
