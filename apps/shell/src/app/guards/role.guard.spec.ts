import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { roleGuard } from './role.guard';

const runGuard = (requiredRole: 'admin' | 'editor' | 'viewer') =>
  TestBed.runInInjectionContext(() =>
    roleGuard(requiredRole)(
      {} as Parameters<ReturnType<typeof roleGuard>>[0],
      { url: '/admin' } as Parameters<ReturnType<typeof roleGuard>>[1],
    ),
  );

describe('roleGuard', () => {
  let routerSpy: { navigate: jest.Mock; createUrlTree: jest.Mock };

  const setup = (overrides: Partial<AuthService>) => {
    routerSpy = {
      navigate: jest.fn(),
      createUrlTree: jest.fn((commands) => commands as unknown as UrlTree),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: overrides },
      ],
    });
  };

  it('redirects unauthenticated user to /login', () => {
    setup({ isAuthenticated: () => false, hasRole: () => false });
    const result = runGuard('admin');
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(
      ['/login'],
      expect.objectContaining({ queryParams: { returnUrl: '/admin' } }),
    );
    expect(result).not.toBe(true);
  });

  it('allows authenticated user with the required role', () => {
    setup({ isAuthenticated: () => true, hasRole: () => true });
    const result = runGuard('admin');
    expect(result).toBe(true);
  });

  it('redirects to /dashboard when user lacks the required role', () => {
    setup({ isAuthenticated: () => true, hasRole: () => false });
    runGuard('admin');
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
  });
});
