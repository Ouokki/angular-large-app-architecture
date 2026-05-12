import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsPageComponent } from './settings-page.component';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  resetSettings,
  selectSettings,
  selectSettingsDirty,
  selectSettingsError,
  selectSettingsLoading,
} from '@angular-large-app/settings/data-access-settings';

const initialState = {
  settings: {
    settings: DEFAULT_SETTINGS,
    loading: false,
    error: null,
    dirty: false,
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
        initialState,
        selectors: [
          { selector: selectSettings, value: DEFAULT_SETTINGS },
          { selector: selectSettingsLoading, value: false },
          { selector: selectSettingsError, value: null },
          { selector: selectSettingsDirty, value: false },
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

  it('renders theme select', () => {
    expect(spectator.query('#theme')).toBeTruthy();
  });

  it('renders language select', () => {
    expect(spectator.query('#language')).toBeTruthy();
  });

  it('renders timezone select', () => {
    expect(spectator.query('#timezone')).toBeTruthy();
  });

  it('renders notifications checkbox', () => {
    expect(spectator.query('#notifications')).toBeTruthy();
  });

  it('renders compact-mode checkbox', () => {
    expect(spectator.query('#compact-mode')).toBeTruthy();
  });

  it('dispatches resetSettings when reset button is clicked', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const btn = spectator.query('button[type="button"]') as HTMLElement;
    btn?.click();
    expect(dispatchSpy).toHaveBeenCalledWith(resetSettings());
  });

  it('shows dirty badge when dirty$ emits true', () => {
    store.overrideSelector(selectSettingsDirty, true);
    store.refreshState();
    spectator.detectChanges();
    expect(spectator.query('.dirty-badge')).toBeTruthy();
  });

  it('shows error banner when error$ emits a message', () => {
    store.overrideSelector(selectSettingsError, 'Load failed');
    store.refreshState();
    spectator.detectChanges();
    expect(spectator.query('[role="alert"]')).toBeTruthy();
  });

  it('shows loading state when loading$ emits true', () => {
    store.overrideSelector(selectSettingsLoading, true);
    store.refreshState();
    spectator.detectChanges();
    expect(spectator.query('[role="status"]')).toBeTruthy();
  });
});
