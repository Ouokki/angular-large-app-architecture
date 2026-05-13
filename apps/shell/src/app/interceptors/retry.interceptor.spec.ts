import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { retryInterceptor } from './retry.interceptor';

describe('retryInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([retryInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('does not retry POST requests', fakeAsync(() => {
    let error: unknown;
    http.post('/api/submit', {}).subscribe({ error: (e) => (error = e) });

    controller.expectOne('/api/submit').flush('Error', { status: 500, statusText: 'Server Error' });
    tick(10000);

    expect(error).toBeDefined();
    // No additional request should have been made
    controller.expectNone('/api/submit');
  }));

  it('retries a GET up to 3 times on failure', fakeAsync(() => {
    let result: unknown;
    http.get('/api/data').subscribe({ next: (r) => (result = r), error: () => undefined });

    // Attempt 1 fails
    controller.expectOne('/api/data').flush('Error', { status: 500, statusText: 'Server Error' });
    tick(1000);
    // Attempt 2 fails
    controller.expectOne('/api/data').flush('Error', { status: 500, statusText: 'Server Error' });
    tick(2000);
    // Attempt 3 succeeds
    controller.expectOne('/api/data').flush({ ok: true });
    tick(3000);

    expect(result).toEqual({ ok: true });
  }));
});
