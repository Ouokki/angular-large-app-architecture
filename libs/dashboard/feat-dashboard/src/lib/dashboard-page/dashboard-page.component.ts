import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MetricsService } from '@angular-large-app/dashboard/data-access-metrics';
import { TableComponent, TableColumn, TableRow } from '@angular-large-app/shared/ui-table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MetricCardComponent } from '../metric-card/metric-card.component';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';
import { SkeletonTableRowComponent } from '../skeleton-table-row/skeleton-table-row.component';

const ACTIVITY_COLUMNS: TableColumn[] = [
  { key: 'id', header: '#', sortable: true, width: '60px' },
  { key: 'user', header: 'User', sortable: true },
  { key: 'action', header: 'Action', sortable: true },
  { key: 'resource', header: 'Resource', sortable: true },
  { key: 'timestamp', header: 'Timestamp', sortable: true },
  { key: 'status', header: 'Status', sortable: true, width: '90px' },
];

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MetricCardComponent,
    SkeletonCardComponent,
    SkeletonTableRowComponent,
    TableComponent,
    DecimalPipe,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  protected readonly metricsService = inject(MetricsService);

  readonly cards = this.metricsService.cards;
  readonly activity = this.metricsService.activity;

  readonly columns = ACTIVITY_COLUMNS;
  readonly filterText = signal('');

  readonly viewState = computed(() => {
    if (this.metricsService.isLoading()) return 'loading' as const;
    if (this.metricsService.error()) return 'error' as const;
    const data = this.metricsService.metrics();
    if (!data || data.length === 0) return 'empty' as const;
    return 'loaded' as const;
  });

  readonly skeletonCards = [1, 2, 3, 4];
  readonly skeletonRows = [1, 2, 3, 4, 5, 6, 7, 8];

  ngOnInit(): void {
    this.metricsService.loadDashboard();
  }

  protected onFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterText.set(input.value);
  }

  protected clearFilter(input: HTMLInputElement): void {
    input.value = '';
    this.filterText.set('');
    input.focus();
  }

  protected get activityAsRows(): TableRow[] {
    return this.activity() as unknown as TableRow[];
  }
}
