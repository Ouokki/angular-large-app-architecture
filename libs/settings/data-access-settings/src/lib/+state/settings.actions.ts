import { createAction, props } from '@ngrx/store';
import { UserSettings } from './settings.model';

export const loadSettings = createAction('[Settings] Load Settings');

export const loadSettingsSuccess = createAction(
  '[Settings] Load Settings Success',
  props<{ settings: UserSettings }>(),
);

export const loadSettingsFailure = createAction(
  '[Settings] Load Settings Failure',
  props<{ error: string }>(),
);

export const updateSettings = createAction(
  '[Settings] Update Settings',
  props<{ patch: Partial<UserSettings> }>(),
);

export const saveSettingsSuccess = createAction('[Settings] Save Settings Success');

export const resetSettings = createAction('[Settings] Reset Settings');
