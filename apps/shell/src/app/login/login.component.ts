import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="login-page">
      <section class="login-panel">
        <span class="login-kicker">Secure workspace</span>
        <h1>Sign in</h1>
        <p>Use any non-empty username and password. This is a local mock auth session.</p>

        <form [formGroup]="form" (ngSubmit)="onLogin()">
          <mat-form-field appearance="outline" subscriptSizing="dynamic">
            <mat-label>Email or username</mat-label>
            <input matInput formControlName="username" autocomplete="username" />
          </mat-form-field>

          <mat-form-field appearance="outline" subscriptSizing="dynamic">
            <mat-label>Password</mat-label>
            <input
              matInput
              type="password"
              formControlName="password"
              autocomplete="current-password"
            />
          </mat-form-field>

          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
            Sign in
          </button>
        </form>
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
        border-radius: 0.5rem;
        box-shadow: 0 22px 50px rgb(15 23 42 / 0.14);
        display: grid;
        gap: 1rem;
        max-width: 440px;
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

      form {
        display: grid;
        gap: 0.9rem;
      }

      button {
        min-height: 44px;
      }
    `,
  ],
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly form = this.formBuilder.group({
    password: ['', Validators.required],
    username: ['', Validators.required],
  });

  protected onLogin(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, username } = this.form.getRawValue();
    this.auth.login(username, password);

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
    void this.router.navigateByUrl(returnUrl);
  }
}
