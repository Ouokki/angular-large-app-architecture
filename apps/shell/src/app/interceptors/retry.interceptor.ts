import { HttpInterceptorFn } from '@angular/common/http';
import { retry, timer } from 'rxjs';

const MAX_RETRIES = 3;

/**
 * Retries idempotent GET requests on network or 5xx failures.
 * Uses linear backoff: attempt 1 → 1 s, attempt 2 → 2 s, attempt 3 → 3 s.
 * Mutations (POST/PUT/PATCH/DELETE) are never retried automatically.
 */
export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') {
    return next(req);
  }

  return next(req).pipe(
    retry({
      count: MAX_RETRIES,
      delay: (_, attempt) => timer(attempt * 1000),
    }),
  );
};
