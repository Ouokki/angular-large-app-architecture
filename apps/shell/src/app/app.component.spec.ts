import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  selectTheme,
  SETTINGS_FEATURE_KEY,
} from '@angular-large-app/settings/data-access-settings';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([])],
      providers: [
        provideMockStore({
          initialState: {
            [SETTINGS_FEATURE_KEY]: {
              error: null,
              lastSaved: null,
              loading: false,
              previousSettings: null,
              saving: false,
              settings: DEFAULT_SETTINGS,
            },
          },
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
  });

  it('renders the main navigation', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const nav = (fixture.nativeElement as HTMLElement).querySelector('nav');
    expect(nav).toBeTruthy();
  });

  it('has a title of shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.title).toBe('shell');
  });

  it('does not show the loading bar initially', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const bar = (fixture.nativeElement as HTMLElement).querySelector('[role="progressbar"]');
    expect(bar).toBeNull();
  });

  it('loads settings from the shell root', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    TestBed.createComponent(AppComponent);
    expect(dispatchSpy).toHaveBeenCalledWith(loadSettings());
  });

  it('applies the persisted theme to the document', () => {
    store.overrideSelector(selectTheme, 'dark');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(document.body.dataset['theme']).toBe('dark');
  });
});
