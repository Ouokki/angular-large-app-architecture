import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/**
 * Preloading strategy that adapts to the user's network conditions.
 *
 * Rationale per connection type:
 * - slow-2g / 2g: skip entirely — preloading would compete with essential requests
 *   on a connection where every kilobyte matters.
 * - saveData: honour the user's explicit "reduce data usage" preference; preloading
 *   would directly contradict it.
 * - 3g: delay 3 seconds so the critical render path (LCP, TTI) completes first before
 *   background-loading lazy routes.
 * - 4g / unknown: 1-second idle delay still avoids competing with initial page scripts
 *   while keeping navigation instant on fast connections.
 *
 * Routes opt out individually via `data: { preload: false }`.
 */
@Injectable({ providedIn: 'root' })
export class ConnectionAwarePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    // Routes with data.preload === false are never preloaded
    if (route.data?.['preload'] === false) return of(null);

    const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;

    // Respect user's data-saving preference
    if (conn?.saveData) return of(null);

    // Don't preload on very slow connections
    if (conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g') return of(null);

    // Delay preload to avoid competing with critical render path
    const delayMs = conn?.effectiveType === '3g' ? 3000 : 1000;
    return timer(delayMs).pipe(switchMap(() => load()));
  }
}

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}
