export interface MetricCard {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: number;
  trendDirection: 'up' | 'down' | 'flat';
}

export interface ActivityRow {
  id: number;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

export interface MetricsState {
  cards: MetricCard[];
  activity: ActivityRow[];
  loading: boolean;
  error: string | null;
}
