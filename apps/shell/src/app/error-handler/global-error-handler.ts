import { ErrorHandler, inject, Injectable, NgZone } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly notification = inject(NotificationService);
  private readonly zone = inject(NgZone);

  handleError(error: unknown): void {
    // Always log to console so nothing is silently swallowed.
    console.error('[GlobalErrorHandler]', error);

    // MatSnackBar requires change detection — run inside Angular's zone
    // in case the error was thrown outside (e.g. a setTimeout or 3rd-party lib).
    this.zone.run(() => {
      this.notification.error('An unexpected error occurred. Please try again.');
    });
  }
}
