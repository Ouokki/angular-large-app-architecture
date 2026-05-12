import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _authenticated = signal(true);

  isAuthenticated(): boolean {
    return this._authenticated();
  }

  login(): void {
    this._authenticated.set(true);
  }

  logout(): void {
    this._authenticated.set(false);
  }
}
