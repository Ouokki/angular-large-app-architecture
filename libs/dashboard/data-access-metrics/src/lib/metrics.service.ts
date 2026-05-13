import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivityRow, MetricCard, MetricsState } from './metrics.model';

const MOCK_CARDS: MetricCard[] = [
  { id: 'users', label: 'Active Users', value: 8_421, unit: '', trend: 12.4, trendDirection: 'up' },
  {
    id: 'revenue',
    label: 'Revenue',
    value: 142_580,
    unit: '$',
    trend: -3.2,
    trendDirection: 'down',
  },
  {
    id: 'requests',
    label: 'API Requests',
    value: 1_204_309,
    unit: '',
    trend: 0.8,
    trendDirection: 'flat',
  },
  { id: 'errors', label: 'Error Rate', value: 0.42, unit: '%', trend: -18, trendDirection: 'down' },
];

function generateActivity(count: number): ActivityRow[] {
  const actions = ['created', 'updated', 'deleted', 'viewed', 'exported'];
  const resources = ['User', 'Report', 'Dashboard', 'Setting', 'Export'];
  const statuses: ActivityRow['status'][] = ['success', 'warning', 'error'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    user: `user${(i % 50) + 1}@example.com`,
    action: actions[i % actions.length],
    resource: `${resources[i % resources.length]} #${Math.floor(i / 5) + 1}`,
    timestamp: new Date(Date.now() - i * 60_000).toISOString(),
    status: statuses[i % 3],
  }));
}

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private readonly http = inject(HttpClient);

  private readonly _state = signal<MetricsState>({
    cards: [],
    activity: [],
    loading: false,
    error: null,
  });

  readonly cards = computed(() => this._state().cards);
  readonly activity = computed(() => this._state().activity);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);

  // Aliases used by the viewState computed signal in the dashboard component
  readonly isLoading = this.loading;
  readonly metrics = this.cards;

  loadDashboard(): void {
    this._state.update((s) => ({ ...s, loading: true, error: null }));

    // In production, replace with: this.http.get<MetricCard[]>('/api/metrics/cards')
    void this.http;

    try {
      const cards = MOCK_CARDS;
      const activity = generateActivity(10_000);
      this._state.set({ cards, activity, loading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this._state.update((s) => ({ ...s, loading: false, error: message }));
    }
  }

  reload(): void {
    this._state.update((s) => ({ ...s, loading: true, error: null }));
    this.loadDashboard();
  }

  refreshCards(): void {
    const updated = MOCK_CARDS.map((c) => ({
      ...c,
      value: c.value * (1 + (Math.random() - 0.5) * 0.05),
    }));
    this._state.update((s) => ({ ...s, cards: updated }));
  }
}
