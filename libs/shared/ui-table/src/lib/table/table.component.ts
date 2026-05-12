import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';

export type TableRow = Record<string, unknown>;

export interface TableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: string;
  direction: SortDirection;
}

@Component({
  selector: 'app-ui-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollingModule, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  readonly columns = input<TableColumn[]>([]);
  readonly data = input<TableRow[]>([]);
  readonly rowHeight = input(48);
  readonly visibleRows = input(10);
  readonly filterText = input('');
  readonly ariaLabel = input('Data table');

  readonly sortChanged = output<SortState>();
  readonly rowClicked = output<TableRow>();

  protected readonly sortState = signal<SortState>({ column: '', direction: null });

  readonly filteredData = computed(() => {
    const filter = this.filterText().toLowerCase().trim();
    const rows = this.data();
    if (!filter) return rows;
    return rows.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(filter)),
    );
  });

  readonly sortedData = computed(() => {
    const { column, direction } = this.sortState();
    const rows = [...this.filteredData()];
    if (!column || !direction) return rows;
    return rows.sort((a, b) => {
      const av = String(a[column] ?? '');
      const bv = String(b[column] ?? '');
      const cmp = av.localeCompare(bv, undefined, { numeric: true });
      return direction === 'asc' ? cmp : -cmp;
    });
  });

  readonly tableHeight = computed(() => `${this.rowHeight() * this.visibleRows()}px`);

  protected onSort(column: string, sortable: boolean | undefined): void {
    if (!sortable) return;
    const current = this.sortState();
    let direction: SortDirection;
    if (current.column !== column) {
      direction = 'asc';
    } else if (current.direction === 'asc') {
      direction = 'desc';
    } else {
      direction = null;
    }
    const next: SortState = { column, direction };
    this.sortState.set(next);
    this.sortChanged.emit(next);
  }

  protected onRowClick(row: TableRow): void {
    this.rowClicked.emit(row);
  }

  protected trackByIndex(index: number): number {
    return index;
  }

  protected getCellValue(row: TableRow, key: string): string {
    return String(row[key] ?? '');
  }

  protected getSortIcon(column: string): string {
    const { column: col, direction } = this.sortState();
    if (col !== column) return '↕';
    if (direction === 'asc') return '↑';
    if (direction === 'desc') return '↓';
    return '↕';
  }
}
