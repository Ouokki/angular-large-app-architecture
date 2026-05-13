import {
  loadSettings,
  loadSettingsFailure,
  loadSettingsSuccess,
  saveSettings,
  saveSettingsFailure,
  saveSettingsSuccess,
} from './settings.actions';
import { initialState, settingsReducer } from './settings.reducer';
import { DEFAULT_SETTINGS } from './settings.model';

describe('settingsReducer', () => {
  it('returns initial state by default', () => {
    const state = settingsReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('sets loading true and clears error on loadSettings', () => {
    const state = settingsReducer({ ...initialState, error: 'prev error' }, loadSettings());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('applies settings and clears loading on loadSettingsSuccess', () => {
    const settings = { ...DEFAULT_SETTINGS, theme: 'dark' as const };
    const loading = settingsReducer(initialState, loadSettings());
    const state = settingsReducer(loading, loadSettingsSuccess({ settings }));
    expect(state.settings.theme).toBe('dark');
    expect(state.loading).toBe(false);
  });

  it('sets error on loadSettingsFailure', () => {
    const state = settingsReducer(initialState, loadSettingsFailure({ error: 'Load failed' }));
    expect(state.error).toBe('Load failed');
    expect(state.loading).toBe(false);
  });

  it('applies optimistic update and stores previousSettings on saveSettings', () => {
    const newSettings = { ...DEFAULT_SETTINGS, theme: 'dark' as const };
    const state = settingsReducer(initialState, saveSettings({ settings: newSettings }));
    expect(state.settings.theme).toBe('dark');
    expect(state.previousSettings).toEqual(DEFAULT_SETTINGS);
    expect(state.saving).toBe(true);
    expect(state.error).toBeNull();
  });

  it('clears previousSettings and sets lastSaved on saveSettingsSuccess', () => {
    const intermediate = settingsReducer(
      initialState,
      saveSettings({ settings: { ...DEFAULT_SETTINGS, theme: 'dark' as const } }),
    );
    const state = settingsReducer(
      intermediate,
      saveSettingsSuccess({ settings: intermediate.settings }),
    );
    expect(state.previousSettings).toBeNull();
    expect(state.saving).toBe(false);
    expect(state.lastSaved).not.toBeNull();
  });

  it('rolls back to previousSettings on saveSettingsFailure', () => {
    const newSettings = { ...DEFAULT_SETTINGS, theme: 'dark' as const };
    const intermediate = settingsReducer(initialState, saveSettings({ settings: newSettings }));
    const state = settingsReducer(
      intermediate,
      saveSettingsFailure({ previousSettings: DEFAULT_SETTINGS, error: 'err' }),
    );
    expect(state.settings).toEqual(DEFAULT_SETTINGS);
    expect(state.previousSettings).toBeNull();
    expect(state.saving).toBe(false);
    expect(state.error).toBeTruthy();
  });
});
