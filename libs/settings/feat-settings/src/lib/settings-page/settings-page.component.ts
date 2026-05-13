import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  DEFAULT_SETTINGS,
  UserSettings,
  loadSettings,
  saveSettings,
  selectError,
  selectLastSaved,
  selectLoading,
  selectSaving,
  selectSettings,
} from '@angular-large-app/settings/data-access-settings';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  readonly settings = toSignal(this.store.select(selectSettings), {
    initialValue: DEFAULT_SETTINGS,
  });
  readonly loading = toSignal(this.store.select(selectLoading), { initialValue: false });
  readonly saving = toSignal(this.store.select(selectSaving), { initialValue: false });
  readonly error = toSignal(this.store.select(selectError), { initialValue: null });
  readonly lastSaved = toSignal(this.store.select(selectLastSaved), { initialValue: null });

  readonly form = this.fb.group({
    displayName: this.fb.nonNullable.control('', [Validators.required]),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    theme: this.fb.nonNullable.control<UserSettings['theme']>('light'),
    language: this.fb.nonNullable.control('', [Validators.required]),
    timezone: this.fb.nonNullable.control('', [Validators.required]),
    notifications: this.fb.nonNullable.group({
      email: this.fb.nonNullable.control(true),
      push: this.fb.nonNullable.control(true),
      sms: this.fb.nonNullable.control(false),
    }),
  });

  constructor() {
    // Patch the form whenever the store emits a new settings value (e.g. after load)
    effect(() => {
      const s = this.settings();
      this.form.patchValue(s, { emitEvent: false });
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadSettings());
  }

  protected onSave(): void {
    if (this.form.invalid) return;
    this.store.dispatch(saveSettings({ settings: this.form.getRawValue() as UserSettings }));
  }
}
