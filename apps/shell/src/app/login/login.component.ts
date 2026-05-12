import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="login-page">
      <section class="login-panel">
        <span class="login-kicker">Secure workspace</span>
        <h1>Sign in</h1>
        <p>Continue into the architecture console with the demo identity.</p>
        <button mat-flat-button color="primary" type="button" (click)="onLogin()">
          Continue demo session
        </button>
      </section>
    </main>
  `,
  styles: [
    `
      .login-page {
        align-items: center;
        display: flex;
        justify-content: center;
        min-height: calc(100vh - 82px);
        padding: 2rem;
      }

      .login-panel {
        background: #fff;
        border: 1px solid #dbe3ec;
        border-radius: 0.75rem;
        box-shadow: 0 22px 50px rgb(15 23 42 / 0.14);
        display: grid;
        gap: 0.85rem;
        max-width: 420px;
        padding: 2rem;
        width: 100%;
      }

      .login-kicker {
        color: #0f766e;
        font-size: 0.72rem;
        font-weight: 850;
        text-transform: uppercase;
      }

      h1 {
        color: #0f172a;
        font-size: 2rem;
        font-weight: 900;
        margin: 0;
      }

      p {
        color: #64748b;
        line-height: 1.55;
        margin: 0 0 0.5rem;
      }
    `,
  ],
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected onLogin(): void {
    this.auth.login();
    void this.router.navigate(['/dashboard']);
  }
}
