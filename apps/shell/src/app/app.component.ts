import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Store } from '@ngrx/store';
import { filter, map, merge } from 'rxjs';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  selectTheme,
  ThemeService,
} from '@angular-large-app/settings/data-access-settings';
import { AuthService } from './services/auth.service';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, MatProgressBarModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly title = 'shell';

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly themeService = inject(ThemeService);

  readonly isAuthenticated = this.auth.authenticated;
  readonly username = this.auth.username;
  readonly theme = toSignal(this.store.select(selectTheme), {
    initialValue: DEFAULT_SETTINGS.theme,
  });

  // Signal is true while a lazy route is loading; drives the progress bar in the template.
  readonly isNavigating = toSignal(
    merge(
      this.router.events.pipe(
        filter((e): e is NavigationStart => e instanceof NavigationStart),
        map(() => true),
      ),
      this.router.events.pipe(
        filter(
          (e): e is NavigationEnd | NavigationCancel | NavigationError =>
            e instanceof NavigationEnd ||
            e instanceof NavigationCancel ||
            e instanceof NavigationError,
        ),
        map(() => false),
      ),
    ),
    { initialValue: false },
  );

  constructor() {
    this.store.dispatch(loadSettings());

    effect(() => {
      this.themeService.apply(this.theme());
    });
  }

  protected logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
