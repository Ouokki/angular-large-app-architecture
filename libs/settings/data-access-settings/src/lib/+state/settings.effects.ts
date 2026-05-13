import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, timer } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  loadSettings,
  loadSettingsFailure,
  loadSettingsSuccess,
  saveSettings,
  saveSettingsFailure,
  saveSettingsSuccess,
} from './settings.actions';
import { DEFAULT_SETTINGS, UserSettings } from './settings.model';
import { selectPreviousSettings } from './settings.selectors';

const STORAGE_KEY = 'user-settings';

function readFromStorage(): UserSettings {
  if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserSettings) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeToStorage(settings: UserSettings): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

@Injectable()
export class SettingsEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  // In production, replace localStorage with HttpClient.
  // The data flow (action → reducer → effect → action) stays identical.
  readonly loadSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSettings),
      switchMap(() =>
        of(readFromStorage()).pipe(
          map((settings) => loadSettingsSuccess({ settings })),
          catchError((err: unknown) => {
            const message = err instanceof Error ? err.message : 'Load failed';
            return of(loadSettingsFailure({ error: message }));
          }),
        ),
      ),
    ),
  );

  readonly saveSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveSettings),
      // Capture previousSettings from the store right after the optimistic update
      withLatestFrom(this.store.select(selectPreviousSettings)),
      switchMap(([action, previousSettings]) =>
        timer(800).pipe(
          map(() => {
            writeToStorage(action.settings);
            return saveSettingsSuccess({ settings: action.settings });
          }),
          catchError((err: unknown) => {
            const message = err instanceof Error ? err.message : 'Save failed';
            return of(
              saveSettingsFailure({
                previousSettings: previousSettings ?? DEFAULT_SETTINGS,
                error: message,
              }),
            );
          }),
        ),
      ),
    ),
  );
}
