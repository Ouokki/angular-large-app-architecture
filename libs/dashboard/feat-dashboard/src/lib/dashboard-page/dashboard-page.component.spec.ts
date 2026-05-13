import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideHttpClient } from '@angular/common/http';
import { MetricsService } from '@angular-large-app/dashboard/data-access-metrics';
import { DashboardPageComponent } from './dashboard-page.component';

describe('DashboardPageComponent', () => {
  let spectator: Spectator<DashboardPageComponent>;
  let metricsService: MetricsService;

  const createComponent = createComponentFactory({
    component: DashboardPageComponent,
    providers: [provideHttpClient()],
  });

  beforeEach(() => {
    spectator = createComponent();
    metricsService = spectator.inject(MetricsService);
  });

  it('calls loadDashboard on init', () => {
    const spy = jest.spyOn(metricsService, 'loadDashboard');
    spectator.component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('renders metric cards after load', () => {
    spectator.component.ngOnInit();
    spectator.detectChanges();
    const cards = spectator.queryAll('app-metric-card');
    expect(cards.length).toBe(4);
  });

  it('renders the activity table after load', () => {
    spectator.component.ngOnInit();
    spectator.detectChanges();
    expect(spectator.query('app-ui-table')).toBeTruthy();
  });

  it('shows skeleton cards when isLoading is true', () => {
    metricsService['_state'].update((s) => ({ ...s, loading: true }));
    spectator.detectChanges();
    expect(spectator.queryAll('app-skeleton-card').length).toBe(4);
  });

  it('shows skeleton table rows when isLoading is true', () => {
    metricsService['_state'].update((s) => ({ ...s, loading: true }));
    spectator.detectChanges();
    expect(spectator.queryAll('app-skeleton-table-row').length).toBe(8);
  });

  it('shows error state with retry button when error is set', () => {
    metricsService['_state'].update((s) => ({
      ...s,
      loading: false,
      cards: [],
      error: 'Network error',
    }));
    spectator.detectChanges();
    expect(spectator.query('[role="alert"]')).toBeTruthy();
    expect(spectator.query('.retry-btn')).toBeTruthy();
    expect(spectator.query('[role="alert"]')?.textContent).toContain('Network error');
  });

  it('shows empty state when metrics array is empty', () => {
    metricsService['_state'].update((s) => ({ ...s, loading: false, cards: [], error: null }));
    spectator.detectChanges();
    expect(spectator.query('.empty-state')).toBeTruthy();
  });

  it('clicking retry calls reload()', () => {
    const reloadSpy = jest.spyOn(metricsService, 'reload');
    metricsService['_state'].update((s) => ({ ...s, loading: false, cards: [], error: 'err' }));
    spectator.detectChanges();
    const btn = spectator.query('.retry-btn') as HTMLButtonElement;
    btn?.click();
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('updates filterText on input event', () => {
    spectator.component.ngOnInit();
    spectator.detectChanges();
    const input = spectator.query('input[type="search"]') as HTMLInputElement;
    input.value = 'alice';
    input.dispatchEvent(new Event('input'));
    expect(spectator.component.filterText()).toBe('alice');
  });

  it('renders activity count in header', () => {
    spectator.component.ngOnInit();
    spectator.detectChanges();
    const eventsIndexed = spectator.query('.hero-stats strong');
    expect(eventsIndexed?.textContent).toContain('10,000');
  });
});
