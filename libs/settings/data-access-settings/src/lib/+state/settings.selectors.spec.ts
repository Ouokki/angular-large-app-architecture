import { selectCompactMode, selectSettingsDirty, selectTheme } from './settings.selectors';
import { initialState, SettingsState } from './settings.reducer';
import { DEFAULT_SETTINGS } from './settings.model';

const state: SettingsState = {
  ...initialState,
  settings: { ...DEFAULT_SETTINGS, theme: 'dark', compactMode: true },
  dirty: true,
};

describe('settings selectors', () => {
  it('selectTheme returns current theme', () => {
    expect(selectTheme.projector(state.settings)).toBe('dark');
  });

  it('selectCompactMode returns compact mode setting', () => {
    expect(selectCompactMode.projector(state.settings)).toBe(true);
  });

  it('selectSettingsDirty returns dirty flag', () => {
    expect(selectSettingsDirty.projector(state)).toBe(true);
  });
});
