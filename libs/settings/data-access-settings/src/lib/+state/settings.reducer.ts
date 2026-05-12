import { createReducer, on } from '@ngrx/store';
import { DEFAULT_SETTINGS, UserSettings } from './settings.model';
import {
  loadSettings,
  loadSettingsFailure,
  loadSettingsSuccess,
  resetSettings,
  updateSettings,
} from './settings.actions';

export interface SettingsState {
  settings: UserSettings;
  loading: boolean;
  error: string | null;
  dirty: boolean;
}

export const initialState: SettingsState = {
  settings: DEFAULT_SETTINGS,
  loading: false,
  error: null,
  dirty: false,
};

export const settingsReducer = createReducer(
  initialState,

  on(loadSettings, (state) => ({ ...state, loading: true, error: null })),

  on(loadSettingsSuccess, (state, { settings }) => ({
    ...state,
    settings,
    loading: false,
    dirty: false,
  })),

  on(loadSettingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(updateSettings, (state, { patch }) => ({
    ...state,
    settings: { ...state.settings, ...patch },
    dirty: true,
  })),

  on(resetSettings, () => ({ ...initialState })),
);
