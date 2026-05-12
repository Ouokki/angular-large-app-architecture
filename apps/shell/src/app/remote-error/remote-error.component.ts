import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-remote-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center p-12 text-center">
      <div class="mb-4 text-4xl" aria-hidden="true">⚠️</div>
      <h2 class="mb-2 text-xl font-semibold text-text-primary">Remote unavailable</h2>
      <p class="mb-6 max-w-sm text-sm text-text-secondary">
        The widget catalog could not be loaded. Make sure the remote is running on
        <code class="font-mono text-primary">localhost:4201</code> or check your network connection.
      </p>
      <a routerLink="/dashboard" class="text-sm font-medium text-primary hover:underline">
        Return to dashboard
      </a>
    </div>
  `,
})
export class RemoteErrorComponent {}
