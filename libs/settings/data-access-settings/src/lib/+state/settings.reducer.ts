import { createReducer, on } from '@ngrx/store';
import { DEFAULT_SETTINGS, UserSettings } from './settings.model';
import {
  loadSettings,
  loadSettingsFailure,
  loadSettingsSuccess,
  saveSettings,
  saveSettingsFailure,
  saveSettingsSuccess,
} from './settings.actions';

export interface SettingsState {
  settings: UserSettings;
  previousSettings: UserSettings | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  lastSaved: string | null;
}

export const initialState: SettingsState = {
  settings: DEFAULT_SETTINGS,
  previousSettings: null,
  loading: false,
  saving: false,
  error: null,
  lastSaved: null,
};

export const settingsReducer = createReducer(
  initialState,

  on(loadSettings, (state) => ({ ...state, loading: true, error: null })),

  on(loadSettingsSuccess, (state, { settings }) => ({
    ...state,
    settings,
    loading: false,
    error: null,
  })),

  on(loadSettingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Optimistic update: apply new settings immediately, keep previous for rollback
  on(saveSettings, (state, { settings }) => ({
    ...state,
    previousSettings: state.settings,
    settings,
    saving: true,
    error: null,
  })),

  on(saveSettingsSuccess, (state, { settings }) => ({
    ...state,
    settings,
    previousSettings: null,
    saving: false,
    lastSaved: new Date().toISOString(),
  })),

  // Rollback: restore previousSettings when the persist step fails
  on(saveSettingsFailure, (state, { previousSettings }) => ({
    ...state,
    settings: previousSettings,
    previousSettings: null,
    saving: false,
    error: 'Failed to save settings. Your changes have been reverted.',
  })),
);
