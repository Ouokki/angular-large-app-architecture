import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let notification: { error: jest.Mock };
  let auth: { logout: jest.Mock };
  let router: { navigate: jest.Mock };

  beforeEach(() => {
    notification = { error: jest.fn() };
    auth = { logout: jest.fn() };
    router = { navigate: jest.fn().mockResolvedValue(true) };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: NotificationService, useValue: notification },
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router },
      ],
    });

    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('shows a session-expired notification and logs out on 401', () => {
    http.get('/api/secure').subscribe({ error: () => undefined });
    controller
      .expectOne('/api/secure')
      .flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    expect(auth.logout).toHaveBeenCalled();
    expect(notification.error).toHaveBeenCalledWith(expect.stringContaining('session has expired'));
  });

  it('shows a server-error notification on 500', () => {
    http.get('/api/data').subscribe({ error: () => undefined });
    controller
      .expectOne('/api/data')
      .flush('Server Error', { status: 500, statusText: 'Server Error' });
    expect(notification.error).toHaveBeenCalledWith(expect.stringContaining('Server error'));
  });

  it('shows the API message on 400', () => {
    http.get('/api/data').subscribe({ error: () => undefined });
    controller
      .expectOne('/api/data')
      .flush({ message: 'Validation failed' }, { status: 400, statusText: 'Bad Request' });
    expect(notification.error).toHaveBeenCalledWith('Validation failed');
  });
});
