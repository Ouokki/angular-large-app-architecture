import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import {
  loadSettings,
  resetSettings,
  selectSettings,
  selectSettingsDirty,
  selectSettingsError,
  selectSettingsLoading,
  updateSettings,
  UserSettings,
} from '@angular-large-app/settings/data-access-settings';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    MatButtonModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  readonly loading$ = this.store.select(selectSettingsLoading);
  readonly error$ = this.store.select(selectSettingsError);
  readonly dirty$ = this.store.select(selectSettingsDirty);

  readonly form = this.fb.group({
    theme: this.fb.nonNullable.control<UserSettings['theme']>('system'),
    language: this.fb.nonNullable.control('', [Validators.required]),
    notificationsEnabled: this.fb.nonNullable.control(true),
    compactMode: this.fb.nonNullable.control(false),
    timezone: this.fb.nonNullable.control('', [Validators.required]),
  });

  ngOnInit(): void {
    this.store.dispatch(loadSettings());

    this.store
      .select(selectSettings)
      .pipe(takeUntil(this.destroy$))
      .subscribe((settings) => {
        this.form.patchValue(settings, { emitEvent: false });
      });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((patch) => {
      this.store.dispatch(updateSettings({ patch: patch as Partial<UserSettings> }));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onReset(): void {
    this.store.dispatch(resetSettings());
  }
}
