import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MetricCard } from '@angular-large-app/dashboard/data-access-metrics';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss',
})
export class MetricCardComponent {
  readonly card = input.required<MetricCard>();

  protected get formattedValue(): string {
    const { value, unit } = this.card();
    const formatted =
      value >= 1_000_000
        ? `${(value / 1_000_000).toFixed(1)}M`
        : value >= 1_000
        ? `${(value / 1_000).toFixed(1)}K`
        : value % 1 === 0
        ? value.toString()
        : value.toFixed(2);
    return unit ? `${unit}${formatted}` : formatted;
  }

  protected get trendClass(): string {
    const dir = this.card().trendDirection;
    if (dir === 'up') return 'trend-up';
    if (dir === 'down') return 'trend-down';
    return 'trend-flat';
  }

  protected get trendIcon(): string {
    const dir = this.card().trendDirection;
    if (dir === 'up') return '↑';
    if (dir === 'down') return '↓';
    return '→';
  }
}
