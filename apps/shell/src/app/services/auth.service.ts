import { computed, Injectable, signal } from '@angular/core';

interface MockAuthSession {
  readonly issuedAt: string;
  readonly token: string;
  readonly username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'angular-architecture.mock-auth';
  private readonly session = signal<MockAuthSession | null>(this.readSession());

  readonly authenticated = computed(() => this.session() !== null);
  readonly username = computed(() => this.session()?.username ?? 'Guest');
  readonly token = computed(() => this.session()?.token ?? null);

  isAuthenticated(): boolean {
    return this.authenticated();
  }

  login(username: string, password: string): void {
    const session: MockAuthSession = {
      issuedAt: new Date().toISOString(),
      token: this.createMockToken(username, password),
      username,
    };

    this.session.set(session);
    this.writeSession(session);
  }

  logout(): void {
    this.session.set(null);
    this.clearSession();
  }

  private createMockToken(username: string, password: string): string {
    return ['mock-jwt', encodeURIComponent(username.trim()), password.length, Date.now()].join('.');
  }

  private readSession(): MockAuthSession | null {
    try {
      const stored = localStorage.getItem(this.storageKey);

      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored) as Partial<MockAuthSession>;

      if (!parsed.token || !parsed.username || !parsed.issuedAt) {
        return null;
      }

      return {
        issuedAt: parsed.issuedAt,
        token: parsed.token,
        username: parsed.username,
      };
    } catch {
      return null;
    }
  }

  private writeSession(session: MockAuthSession): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(session));
    } catch {
      // Auth still works in-memory if storage is unavailable.
    }
  }

  private clearSession(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // Nothing to clear when storage is unavailable.
    }
  }
}
