import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserSettings } from './settings.model';

export const SettingsActions = createActionGroup({
  source: 'Settings',
  events: {
    'Load Settings': emptyProps(),
    'Load Settings Success': props<{ settings: UserSettings }>(),
    'Load Settings Failure': props<{ error: string }>(),
    'Save Settings': props<{ settings: UserSettings }>(),
    'Save Settings Success': props<{ settings: UserSettings }>(),
    'Save Settings Failure': props<{ previousSettings: UserSettings; error: string }>(),
  },
});

export const {
  loadSettings,
  loadSettingsSuccess,
  loadSettingsFailure,
  saveSettings,
  saveSettingsSuccess,
  saveSettingsFailure,
} = SettingsActions;
