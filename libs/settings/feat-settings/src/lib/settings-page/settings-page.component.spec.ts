import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsPageComponent } from './settings-page.component';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  selectError,
  selectLastSaved,
  selectLoading,
  selectSaving,
  selectSettings,
} from '@angular-large-app/settings/data-access-settings';
import { SETTINGS_FEATURE_KEY } from '@angular-large-app/settings/data-access-settings';

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
    spectator = createComponent();
    store = spectator.inject(MockStore);
  });

  it('dispatches loadSettings on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    spectator.component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(loadSettings());
  });

  it('renders the settings form', () => {
    expect(spectator.query('form')).toBeTruthy();
  });

  it('renders display name input', () => {
    expect(spectator.query('#display-name')).toBeTruthy();
  });

  it('renders email input', () => {
    expect(spectator.query('#email')).toBeTruthy();
  });

  it('renders theme select', () => {
    expect(spectator.query('#theme')).toBeTruthy();
  });

  it('renders language select', () => {
    expect(spectator.query('#language')).toBeTruthy();
  });

  it('renders timezone select', () => {
    expect(spectator.query('#timezone')).toBeTruthy();
  });

  it('renders notifications-email checkbox', () => {
    expect(spectator.query('#notifications-email')).toBeTruthy();
  });

  it('renders notifications-push checkbox', () => {
    expect(spectator.query('#notifications-push')).toBeTruthy();
  });

  it('renders notifications-sms checkbox', () => {
    expect(spectator.query('#notifications-sms')).toBeTruthy();
  });

  it('dispatches saveSettings with form values when save button is clicked', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    spectator.component.form.patchValue(DEFAULT_SETTINGS);
    spectator.detectChanges();
    const btn = spectator.query('button[type="button"]') as HTMLButtonElement;
    btn?.click();
    expect(dispatchSpy).toHaveBeenCalledWith(
      saveSettings({ settings: spectator.component.form.getRawValue() as typeof DEFAULT_SETTINGS }),
    );
  });

  it('shows "Saving…" text when saving is true', () => {
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
