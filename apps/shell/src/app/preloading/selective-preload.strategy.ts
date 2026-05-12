import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

interface NavigatorWithConnection extends Navigator {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class SelectivePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (!route.data?.['preload']) {
      return of(null);
    }

    const nav = navigator as NavigatorWithConnection;
    if (nav.connection?.saveData) {
      return of(null);
    }

    const effectiveType = nav.connection?.effectiveType ?? '4g';
    if (effectiveType === '2g' || effectiveType === 'slow-2g') {
      return of(null);
    }

    return load();
  }
}
