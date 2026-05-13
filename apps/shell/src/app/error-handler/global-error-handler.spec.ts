import { TestBed } from '@angular/core/testing';
import { GlobalErrorHandler } from './global-error-handler';
import { NotificationService } from '../services/notification.service';

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;
  let notificationSpy: { error: jest.Mock };

  beforeEach(() => {
    notificationSpy = { error: jest.fn() };

    TestBed.configureTestingModule({
      providers: [GlobalErrorHandler, { provide: NotificationService, useValue: notificationSpy }],
    });

    handler = TestBed.inject(GlobalErrorHandler);
  });

  it('logs the error to console', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    handler.handleError(new Error('boom'));
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('shows an error notification', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    handler.handleError(new Error('boom'));
    expect(notificationSpy.error).toHaveBeenCalledWith(
      'An unexpected error occurred. Please try again.',
    );
  });
});
