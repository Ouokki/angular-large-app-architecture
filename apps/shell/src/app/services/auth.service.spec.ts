import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts signed out when no mock session exists', () => {
    const service = new AuthService();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.username()).toBe('Guest');
  });

  it('accepts arbitrary credentials and stores a mock session', () => {
    const service = new AuthService();

    service.login('demo@example.com', 'anything');

    expect(service.isAuthenticated()).toBe(true);
    expect(service.username()).toBe('demo@example.com');
    expect(localStorage.getItem('angular-architecture.mock-auth')).toContain('mock-jwt');
  });

  it('restores a stored mock session', () => {
    localStorage.setItem(
      'angular-architecture.mock-auth',
      JSON.stringify({
        issuedAt: '2026-05-13T00:00:00.000Z',
        token: 'mock-jwt.demo.8.1',
        username: 'demo',
      }),
    );

    const service = new AuthService();

    expect(service.isAuthenticated()).toBe(true);
    expect(service.username()).toBe('demo');
  });

  it('clears the stored mock session on logout', () => {
    const service = new AuthService();

    service.login('demo', 'password');
    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('angular-architecture.mock-auth')).toBeNull();
  });
});
