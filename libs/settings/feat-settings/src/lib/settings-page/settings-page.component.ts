import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  effect,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import {
  DEFAULT_SETTINGS,
  ThemeService,
  UserSettings,
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
export class SettingsPageComponent implements OnDestroy {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly themeService = inject(ThemeService);

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

  private readonly formValue = toSignal(
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
    {
      initialValue: this.form.getRawValue(),
    },
  );

  protected readonly languageLabels: Record<string, string> = {
    de: 'German',
    en: 'English',
    es: 'Spanish',
    fr: 'French',
  };

  protected readonly hasUnsavedChanges = computed(
    () => JSON.stringify(this.formValue()) !== JSON.stringify(this.settings()),
  );

  protected readonly enabledNotifications = computed(() => {
    const notifications = this.formValue().notifications;
    const enabled = [
      notifications?.email ? 'Email' : null,
      notifications?.push ? 'Push' : null,
      notifications?.sms ? 'SMS' : null,
    ].filter(Boolean);

    return enabled.length > 0 ? enabled.join(', ') : 'None';
  });

  protected readonly selectedLanguage = computed(() => {
    const language = this.formValue().language ?? DEFAULT_SETTINGS.language;
    return this.languageLabels[language] ?? language;
  });

  protected readonly selectedTheme = computed(
    () => this.formValue().theme ?? DEFAULT_SETTINGS.theme,
  );

  protected readonly selectedTimezone = computed(
    () => this.formValue().timezone ?? DEFAULT_SETTINGS.timezone,
  );

  protected readonly timezonePreview = computed(() => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: this.selectedTimezone(),
      }).format(new Date());
    } catch {
      return 'Unavailable';
    }
  });

  constructor() {
    // Patch the form whenever the store emits a new settings value (e.g. after load)
    effect(() => {
      const s = this.settings();
      this.form.reset(s);
    });

    effect(() => {
      this.themeService.apply(this.selectedTheme());
    });
  }

  protected onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.store.dispatch(saveSettings({ settings: this.form.getRawValue() as UserSettings }));
  }

  protected onReset(): void {
    this.form.reset(this.settings());
  }

  ngOnDestroy(): void {
    this.themeService.apply(this.settings().theme);
  }
}
