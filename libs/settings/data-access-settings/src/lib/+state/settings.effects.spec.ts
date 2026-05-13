import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subject } from 'rxjs';
import { Action } from '@ngrx/store';
import { SettingsEffects } from './settings.effects';
import {
  loadSettings,
  loadSettingsSuccess,
  saveSettings,
  saveSettingsSuccess,
} from './settings.actions';
import { DEFAULT_SETTINGS } from './settings.model';
import { initialState } from './settings.reducer';
import { SETTINGS_FEATURE_KEY } from './settings.selectors';

describe('SettingsEffects', () => {
  let actions$: Subject<Action>;
  let effects: SettingsEffects;

  const storeState = { [SETTINGS_FEATURE_KEY]: { ...initialState } };

  beforeEach(() => {
    actions$ = new Subject<Action>();
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => undefined);

    TestBed.configureTestingModule({
      providers: [
        SettingsEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: storeState }),
      ],
    });

    effects = TestBed.inject(SettingsEffects);
    TestBed.inject(MockStore);
  });

  afterEach(() => jest.restoreAllMocks());

  describe('loadSettings$', () => {
    it('dispatches loadSettingsSuccess with DEFAULT_SETTINGS when localStorage is empty', (done) => {
      effects.loadSettings$.subscribe((action) => {
        expect(action).toEqual(loadSettingsSuccess({ settings: DEFAULT_SETTINGS }));
        done();
      });
      actions$.next(loadSettings());
    });

    it('reads stored settings from localStorage', (done) => {
      const stored = { ...DEFAULT_SETTINGS, theme: 'dark' as const };
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(stored));

      effects.loadSettings$.subscribe((action) => {
        expect(action).toEqual(loadSettingsSuccess({ settings: stored }));
        done();
      });
      actions$.next(loadSettings());
    });
  });

  describe('saveSettings$', () => {
    it('writes to localStorage and dispatches saveSettingsSuccess after 800ms', fakeAsync(() => {
      const newSettings = { ...DEFAULT_SETTINGS, theme: 'dark' as const };
      let result: Action | undefined;

      effects.saveSettings$.subscribe((action) => {
        result = action;
      });

      actions$.next(saveSettings({ settings: newSettings }));
      tick(800);

      expect(result).toEqual(saveSettingsSuccess({ settings: newSettings }));
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'user-settings',
        JSON.stringify(newSettings),
      );
    }));
  });
});
