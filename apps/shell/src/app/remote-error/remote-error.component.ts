import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  selector: 'app-remote-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="remote-error-page">
      <section class="remote-error-panel">
        <span class="status-dot" aria-hidden="true"></span>
        <p class="eyebrow">Remote unavailable</p>
        <h2>Widget catalog could not be loaded</h2>
        <p>
          Confirm the remote is running at <code>localhost:4201</code>, then return to the shell.
        </p>
        <a mat-stroked-button routerLink="/dashboard">Return to dashboard</a>
      </section>
    </main>
  `,
  styles: [
    `
      .remote-error-page {
        display: grid;
        min-height: 28rem;
        padding: 2rem;
        place-items: center;
      }

      .remote-error-panel {
        background: #fff;
        border: 1px solid #fecdd3;
        border-radius: 0.75rem;
        box-shadow: 0 18px 42px rgb(15 23 42 / 0.1);
        max-width: 520px;
        padding: 2rem;
        text-align: center;
      }

      .status-dot {
        background: #be123c;
        border-radius: 999px;
        box-shadow: 0 0 0 8px #ffe4e6;
        display: inline-block;
        height: 12px;
        margin-bottom: 1rem;
        width: 12px;
      }

      .eyebrow {
        color: #be123c;
        font-size: 0.72rem;
        font-weight: 850;
        margin: 0;
        text-transform: uppercase;
      }

      h2 {
        color: #0f172a;
        font-size: 1.4rem;
        font-weight: 900;
        margin: 0.35rem 0 0.75rem;
      }

      p {
        color: #64748b;
        line-height: 1.55;
        margin: 0 0 1.25rem;
      }

      code {
        color: #0f766e;
        font-weight: 800;
      }
    `,
  ],
})
export class RemoteErrorComponent {}
