import { ReactiveFormsModule } from '@angular/forms';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  DEFAULT_SETTINGS,
  saveSettings,
  selectError,
  selectLastSaved,
  selectLoading,
  selectSaving,
  selectSettings,
  SETTINGS_FEATURE_KEY,
} from '@angular-large-app/settings/data-access-settings';
import { SettingsPageComponent } from './settings-page.component';

const storeState = {
  [SETTINGS_FEATURE_KEY]: {
    settings: DEFAULT_SETTINGS,
    previousSettings: null,
    loading: false,
    saving: false,
    error: null,
    lastSaved: null,
  },
};

describe('SettingsPageComponent', () => {
  let spectator: Spectator<SettingsPageComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: SettingsPageComponent,
    imports: [ReactiveFormsModule],
    providers: [
      provideMockStore({
        initialState: storeState,
        selectors: [
          { selector: selectSettings, value: DEFAULT_SETTINGS },
          { selector: selectLoading, value: false },
          { selector: selectSaving, value: false },
          { selector: selectError, value: null },
          { selector: selectLastSaved, value: null },
        ],
      }),
    ],
  });

  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
    spectator = createComponent();
    store = spectator.inject(MockStore);
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
  });

  it('renders the settings form fields', () => {
    expect(spectator.query('form')).toBeTruthy();
    expect(spectator.query('#display-name')).toBeTruthy();
    expect(spectator.query('#email')).toBeTruthy();
    expect(spectator.query('#theme')).toBeTruthy();
    expect(spectator.query('#language')).toBeTruthy();
    expect(spectator.query('#timezone')).toBeTruthy();
    expect(spectator.query('#notifications-email')).toBeTruthy();
    expect(spectator.query('#notifications-push')).toBeTruthy();
    expect(spectator.query('#notifications-sms')).toBeTruthy();
  });

  it('shows unsaved changes when the form differs from stored settings', () => {
    spectator.component.form.patchValue({ theme: 'dark' });
    spectator.detectChanges();

    expect(spectator.element.textContent).toContain('Unsaved changes');
  });

  it('dispatches saveSettings with form values when save button is clicked', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    spectator.component.form.patchValue({ theme: 'dark' });
    spectator.detectChanges();

    const btn = spectator.query('button[type="submit"]') as HTMLButtonElement;
    btn.click();

    expect(dispatchSpy).toHaveBeenCalledWith(
      saveSettings({ settings: spectator.component.form.getRawValue() as typeof DEFAULT_SETTINGS }),
    );
  });

  it('shows validation errors instead of silently disabling save', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    spectator.component.form.patchValue({ displayName: '' });
    spectator.detectChanges();

    const btn = spectator.query('button[type="submit"]') as HTMLButtonElement;
    expect(btn.disabled).toBe(false);

    btn.click();
    spectator.detectChanges();

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: '[Settings] Save' }),
    );
    expect(spectator.element.textContent).toContain('Display name is required.');
    expect(spectator.element.textContent).toContain('Fix the highlighted fields before saving.');
  });

  it('resets unsaved changes to the stored settings', () => {
    spectator.component.form.patchValue({ theme: 'dark' });
    spectator.detectChanges();

    const reset = spectator.query('.btn-secondary') as HTMLButtonElement;
    reset.click();
    spectator.detectChanges();

    expect(spectator.component.form.getRawValue().theme).toBe(DEFAULT_SETTINGS.theme);
    expect(spectator.element.textContent).not.toContain('Unsaved changes');
  });

  it('updates preview values when settings controls change', () => {
    spectator.component.form.patchValue({
      language: 'fr',
      notifications: { email: true, push: false, sms: true },
      timezone: 'Europe/Paris',
    });
    spectator.detectChanges();

    expect(spectator.element.textContent).toContain('French');
    expect(spectator.element.textContent).toContain('Europe/Paris');
    expect(spectator.element.textContent).toContain('Email, SMS');
  });

  it('applies theme changes while editing settings', () => {
    spectator.component.form.patchValue({ theme: 'dark' });
    spectator.detectChanges();

    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(document.body.dataset['theme']).toBe('dark');
  });

  it('restores the saved theme when leaving with unsaved theme changes', () => {
    spectator.component.form.patchValue({ theme: 'dark' });
    spectator.detectChanges();

    spectator.component.ngOnDestroy();

    expect(document.documentElement.dataset['theme']).toBe(DEFAULT_SETTINGS.theme);
    expect(document.body.dataset['theme']).toBe(DEFAULT_SETTINGS.theme);
  });

  it('shows saving text when saving is true', () => {
    store.overrideSelector(selectSaving, true);
    store.refreshState();
    spectator.detectChanges();
    expect(spectator.element.textContent).toContain('Saving');
  });

  it('shows error banner when error emits a message', () => {
    store.overrideSelector(selectError, 'Failed to save settings.');
    store.refreshState();
    spectator.detectChanges();
    expect(spectator.query('[role="alert"]')).toBeTruthy();
  });

  it('shows loading state when loading is true', () => {
    store.overrideSelector(selectLoading, true);
    store.refreshState();
    spectator.detectChanges();
    expect(spectator.query('[role="status"]')).toBeTruthy();
  });

  it('shows saved badge when lastSaved has a value', () => {
    store.overrideSelector(selectLastSaved, '2026-01-01T00:00:00.000Z');
    store.refreshState();
    spectator.detectChanges();
    expect(spectator.query('.saved-badge')).toBeTruthy();
  });
});
