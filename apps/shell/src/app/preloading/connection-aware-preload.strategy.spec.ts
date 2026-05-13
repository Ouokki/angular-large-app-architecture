import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Route } from '@angular/router';
import { of } from 'rxjs';
import { ConnectionAwarePreloadingStrategy } from './connection-aware-preload.strategy';

function setConnection(props: Record<string, unknown> | null): void {
  Object.defineProperty(navigator, 'connection', {
    value: props,
    configurable: true,
    writable: true,
  });
}

describe('ConnectionAwarePreloadingStrategy', () => {
  let strategy: ConnectionAwarePreloadingStrategy;
  const load = () => of('loaded');
  const route: Route = { path: 'test' };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    strategy = TestBed.inject(ConnectionAwarePreloadingStrategy);
  });

  afterEach(() => setConnection(null));

  it('returns of(null) when saveData is true', (done) => {
    setConnection({ saveData: true });
    strategy.preload(route, load).subscribe((v) => {
      expect(v).toBeNull();
      done();
    });
  });

  it('returns of(null) when effectiveType is 2g', (done) => {
    setConnection({ effectiveType: '2g' });
    strategy.preload(route, load).subscribe((v) => {
      expect(v).toBeNull();
      done();
    });
  });

  it('returns of(null) when effectiveType is slow-2g', (done) => {
    setConnection({ effectiveType: 'slow-2g' });
    strategy.preload(route, load).subscribe((v) => {
      expect(v).toBeNull();
      done();
    });
  });

  it('calls load() after 3s delay when effectiveType is 3g', fakeAsync(() => {
    setConnection({ effectiveType: '3g' });
    let result: unknown;
    strategy.preload(route, load).subscribe((v) => (result = v));
    tick(2999);
    expect(result).toBeUndefined();
    tick(1);
    expect(result).toBe('loaded');
  }));

  it('calls load() after 1s delay when effectiveType is 4g', fakeAsync(() => {
    setConnection({ effectiveType: '4g' });
    let result: unknown;
    strategy.preload(route, load).subscribe((v) => (result = v));
    tick(999);
    expect(result).toBeUndefined();
    tick(1);
    expect(result).toBe('loaded');
  }));

  it('calls load() after 1s delay when navigator.connection is undefined (graceful fallback)', fakeAsync(() => {
    setConnection(null);
    let result: unknown;
    strategy.preload(route, load).subscribe((v) => (result = v));
    tick(999);
    expect(result).toBeUndefined();
    tick(1);
    expect(result).toBe('loaded');
  }));

  it('returns of(null) when route has data: { preload: false }', (done) => {
    setConnection({ effectiveType: '4g' });
    const optOutRoute: Route = { path: 'opt-out', data: { preload: false } };
    strategy.preload(optOutRoute, load).subscribe((v) => {
      expect(v).toBeNull();
      done();
    });
  });
});
