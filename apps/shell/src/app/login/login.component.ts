import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 class="text-2xl font-bold">Sign In</h1>
      <button
        class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        type="button"
        (click)="onLogin()"
      >
        Continue (Demo)
      </button>
    </div>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected onLogin(): void {
    this.auth.login();
    void this.router.navigate(['/dashboard']);
  }
}
