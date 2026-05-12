import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MetricCard } from '@angular-large-app/dashboard/data-access-metrics';
import { MetricCardComponent } from './metric-card.component';

const CARD_UP: MetricCard = {
  id: 'users',
  label: 'Active Users',
  value: 8421,
  unit: '',
  trend: 12.4,
  trendDirection: 'up',
};

const CARD_DOWN: MetricCard = {
  id: 'revenue',
  label: 'Revenue',
  value: 142580,
  unit: '$',
  trend: -3.2,
  trendDirection: 'down',
};

const CARD_FLAT: MetricCard = {
  id: 'errors',
  label: 'Error Rate',
  value: 0.42,
  unit: '',
  trend: 0,
  trendDirection: 'flat',
};

describe('MetricCardComponent', () => {
  let spectator: Spectator<MetricCardComponent>;

  const createComponent = createComponentFactory({
    component: MetricCardComponent,
  });

  it('renders the card label', () => {
    spectator = createComponent({ props: { card: CARD_UP } });
    expect(spectator.query('.metric-label')?.textContent?.trim()).toBe('Active Users');
  });

  it('formats large value with K suffix', () => {
    spectator = createComponent({ props: { card: CARD_UP } });
    expect(spectator.query('.metric-value')?.textContent?.trim()).toBe('8.4K');
  });

  it('formats very large value with $ prefix and K suffix', () => {
    spectator = createComponent({ props: { card: CARD_DOWN } });
    expect(spectator.query('.metric-value')?.textContent?.trim()).toBe('$142.6K');
  });

  it('formats decimal value', () => {
    spectator = createComponent({ props: { card: CARD_FLAT } });
    expect(spectator.query('.metric-value')?.textContent?.trim()).toBe('0.42');
  });

  it('applies trend-up class for up direction', () => {
    spectator = createComponent({ props: { card: CARD_UP } });
    expect(spectator.query('.trend-up')).toBeTruthy();
  });

  it('applies trend-down class for down direction', () => {
    spectator = createComponent({ props: { card: CARD_DOWN } });
    expect(spectator.query('.trend-down')).toBeTruthy();
  });

  it('applies trend-flat class for flat direction', () => {
    spectator = createComponent({ props: { card: CARD_FLAT } });
    expect(spectator.query('.trend-flat')).toBeTruthy();
  });

  it('renders up arrow icon for up trend', () => {
    spectator = createComponent({ props: { card: CARD_UP } });
    expect(spectator.query('.metric-trend')?.textContent).toContain('↑');
  });

  it('renders down arrow icon for down trend', () => {
    spectator = createComponent({ props: { card: CARD_DOWN } });
    expect(spectator.query('.metric-trend')?.textContent).toContain('↓');
  });
});
