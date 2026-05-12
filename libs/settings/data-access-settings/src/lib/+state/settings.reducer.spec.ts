import {
  loadSettings,
  loadSettingsFailure,
  loadSettingsSuccess,
  resetSettings,
  updateSettings,
} from './settings.actions';
import { initialState, settingsReducer } from './settings.reducer';
import { DEFAULT_SETTINGS } from './settings.model';

describe('settingsReducer', () => {
  it('returns initial state by default', () => {
    const state = settingsReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('sets loading true on loadSettings', () => {
    const state = settingsReducer(initialState, loadSettings());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('sets settings and clears loading on loadSettingsSuccess', () => {
    const settings = { ...DEFAULT_SETTINGS, theme: 'dark' as const };
    const loading = settingsReducer(initialState, loadSettings());
    const state = settingsReducer(loading, loadSettingsSuccess({ settings }));
    expect(state.settings.theme).toBe('dark');
    expect(state.loading).toBe(false);
    expect(state.dirty).toBe(false);
  });

  it('sets error on loadSettingsFailure', () => {
    const state = settingsReducer(initialState, loadSettingsFailure({ error: 'err' }));
    expect(state.error).toBe('err');
    expect(state.loading).toBe(false);
  });

  it('merges patch on updateSettings', () => {
    const state = settingsReducer(initialState, updateSettings({ patch: { language: 'fr' } }));
    expect(state.settings.language).toBe('fr');
    expect(state.dirty).toBe(true);
  });

  it('preserves other settings on partial patch', () => {
    const state = settingsReducer(initialState, updateSettings({ patch: { compactMode: true } }));
    expect(state.settings.theme).toBe(DEFAULT_SETTINGS.theme);
    expect(state.settings.compactMode).toBe(true);
  });

  it('resets to initial state on resetSettings', () => {
    const modified = settingsReducer(
      initialState,
      updateSettings({ patch: { language: 'de', compactMode: true } }),
    );
    const state = settingsReducer(modified, resetSettings());
    expect(state).toEqual(initialState);
  });
});
