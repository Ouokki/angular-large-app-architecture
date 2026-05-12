import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TableComponent, TableColumn, TableRow } from './table.component';

const COLUMNS: TableColumn[] = [
  { key: 'id', header: 'ID', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'age', header: 'Age', sortable: false },
];

const DATA: TableRow[] = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Charlie', age: 35 },
];

describe('TableComponent', () => {
  let spectator: Spectator<TableComponent>;

  const createComponent = createComponentFactory({
    component: TableComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: { columns: COLUMNS, data: DATA },
    });
  });

  it('renders column headers', () => {
    const headers = spectator.queryAll('th');
    expect(headers.length).toBe(3);
    expect(headers[0].textContent).toContain('ID');
    expect(headers[1].textContent).toContain('Name');
    expect(headers[2].textContent).toContain('Age');
  });

  it('renders sortable columns as buttons', () => {
    const buttons = spectator.queryAll('th button');
    expect(buttons.length).toBe(2);
  });

  it('shows empty state when data is empty', () => {
    spectator.setInput('data', []);
    spectator.detectChanges();
    expect(spectator.query('div.py-12')).toBeTruthy();
  });

  it('filters rows by filterText', () => {
    spectator.setInput('filterText', 'alice');
    spectator.detectChanges();
    const filtered = spectator.component.filteredData();
    expect(filtered.length).toBe(1);
    expect(filtered[0]['name']).toBe('Alice');
  });

  it('returns all rows when filterText is empty', () => {
    spectator.setInput('filterText', '');
    spectator.detectChanges();
    expect(spectator.component.filteredData().length).toBe(3);
  });

  it('sorts ascending on first click of sortable column', () => {
    spectator.component['onSort']('name', true);
    const sorted = spectator.component.sortedData();
    expect(sorted[0]['name']).toBe('Alice');
    expect(sorted[1]['name']).toBe('Bob');
  });

  it('sorts descending on second click', () => {
    spectator.component['onSort']('name', true);
    spectator.component['onSort']('name', true);
    const sorted = spectator.component.sortedData();
    expect(sorted[0]['name']).toBe('Charlie');
  });

  it('clears sort on third click', () => {
    spectator.component['onSort']('name', true);
    spectator.component['onSort']('name', true);
    spectator.component['onSort']('name', true);
    expect(spectator.component.sortedData().length).toBe(3);
    expect(spectator.component['sortState']().direction).toBeNull();
  });

  it('does not sort non-sortable column', () => {
    spectator.component['onSort']('age', false);
    expect(spectator.component['sortState']().column).toBe('');
  });

  it('emits sortChanged when column is sorted', () => {
    const spy = jest.fn();
    spectator.component.sortChanged.subscribe(spy);
    spectator.component['onSort']('id', true);
    expect(spy).toHaveBeenCalledWith({ column: 'id', direction: 'asc' });
  });

  it('emits rowClicked when row is clicked', () => {
    const spy = jest.fn();
    spectator.component.rowClicked.subscribe(spy);
    spectator.component['onRowClick'](DATA[0]);
    expect(spy).toHaveBeenCalledWith(DATA[0]);
  });

  it('getSortIcon returns ↕ for unsorted column', () => {
    expect(spectator.component['getSortIcon']('name')).toBe('↕');
  });

  it('getSortIcon returns ↑ for asc sorted column', () => {
    spectator.component['onSort']('name', true);
    expect(spectator.component['getSortIcon']('name')).toBe('↑');
  });

  it('getSortIcon returns ↓ for desc sorted column', () => {
    spectator.component['onSort']('name', true);
    spectator.component['onSort']('name', true);
    expect(spectator.component['getSortIcon']('name')).toBe('↓');
  });

  it('handles 10k rows without error', () => {
    const bigData: TableRow[] = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      age: 20 + (i % 50),
    }));
    spectator.setInput('data', bigData);
    spectator.detectChanges();
    expect(spectator.component.filteredData().length).toBe(10000);
  });
});
