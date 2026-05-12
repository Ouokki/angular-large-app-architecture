import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MetricsService } from '@angular-large-app/dashboard/data-access-metrics';
import { TableComponent, TableColumn, TableRow } from '@angular-large-app/shared/ui-table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MetricCardComponent } from '../metric-card/metric-card.component';

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
    TableComponent,
    DecimalPipe,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  private readonly metrics = inject(MetricsService);

  readonly cards = this.metrics.cards;
  readonly activity = this.metrics.activity;
  readonly loading = this.metrics.loading;
  readonly error = this.metrics.error;

  readonly columns = ACTIVITY_COLUMNS;
  readonly filterText = signal('');

  ngOnInit(): void {
    this.metrics.loadDashboard();
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
