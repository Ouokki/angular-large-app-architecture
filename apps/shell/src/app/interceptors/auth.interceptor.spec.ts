import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let authService: { token: () => string | null; isAuthenticated: () => boolean };

  const setup = (token: string | null) => {
    authService = { token: () => token, isAuthenticated: () => token !== null };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  };

  afterEach(() => controller.verify());

  it('adds Authorization header when authenticated', () => {
    setup('mock.token.123');
    http.get('/api/data').subscribe();
    const req = controller.expectOne('/api/data');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock.token.123');
    req.flush({});
  });

  it('does not add Authorization header when not authenticated', () => {
    setup(null);
    http.get('/api/data').subscribe();
    const req = controller.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
