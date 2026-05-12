import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  loadSettings,
  loadSettingsFailure,
  loadSettingsSuccess,
  saveSettingsSuccess,
  updateSettings,
} from './settings.actions';
import { DEFAULT_SETTINGS, UserSettings } from './settings.model';

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

  readonly persistSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSettings),
      tap(({ patch }) => {
        const current = readFromStorage();
        writeToStorage({ ...current, ...patch });
      }),
      map(() => saveSettingsSuccess()),
    ),
  );
}
