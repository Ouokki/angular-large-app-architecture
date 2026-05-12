import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { filter, map, merge } from 'rxjs';

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

  private readonly router = inject(Router);

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
}
