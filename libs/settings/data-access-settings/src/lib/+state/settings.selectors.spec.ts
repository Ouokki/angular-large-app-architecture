import {
  selectError,
  selectLastSaved,
  selectNotifications,
  selectSaving,
  selectSettings,
  selectTheme,
} from './settings.selectors';
import { initialState, SettingsState } from './settings.reducer';
import { DEFAULT_SETTINGS } from './settings.model';

const state: SettingsState = {
  ...initialState,
  settings: { ...DEFAULT_SETTINGS, theme: 'dark' },
  saving: true,
  lastSaved: '2026-01-01T00:00:00.000Z',
};

describe('settings selectors', () => {
  it('selectSettings returns the settings slice', () => {
    expect(selectSettings.projector(state)).toEqual(state.settings);
  });

  it('selectTheme returns current theme', () => {
    expect(selectTheme.projector(state.settings)).toBe('dark');
  });

  it('selectNotifications returns the notifications object', () => {
    expect(selectNotifications.projector(state.settings)).toEqual(DEFAULT_SETTINGS.notifications);
  });

  it('selectSaving returns saving flag', () => {
    expect(selectSaving.projector(state)).toBe(true);
  });

  it('selectError returns null when no error', () => {
    expect(selectError.projector(initialState)).toBeNull();
  });

  it('selectLastSaved returns the ISO timestamp', () => {
    expect(selectLastSaved.projector(state)).toBe('2026-01-01T00:00:00.000Z');
  });
});
