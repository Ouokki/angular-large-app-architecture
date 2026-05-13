import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * Translates HTTP error responses into user-visible notifications.
 *
 * 401 → clears the session and redirects to /login (expired token).
 * 5xx → generic server-error message.
 * 4xx → API-provided message or a generic fallback.
 *
 * The error is re-thrown so callers can still react if needed.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.logout();
        void router.navigate(['/login'], { queryParams: { reason: 'session-expired' } });
        notification.error('Your session has expired. Please sign in again.');
      } else if (error.status >= 500) {
        notification.error('Server error — please try again in a moment.');
      } else if (error.status >= 400) {
        const message =
          (error.error as { message?: string } | null)?.message ??
          'The request could not be completed.';
        notification.error(message);
      }

      return throwError(() => error);
    }),
  );
};
