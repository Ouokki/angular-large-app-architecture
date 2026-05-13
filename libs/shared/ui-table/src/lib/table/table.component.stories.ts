import type { Meta, StoryObj } from '@storybook/angular';
import { TableComponent, TableColumn, TableRow } from './table.component';

const COLUMNS: TableColumn[] = [
  { key: 'id', header: '#', sortable: true, width: '60px' },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'status', header: 'Status', sortable: false, width: '100px' },
];

function makeRows(count: number): TableRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: i % 3 === 0 ? 'active' : i % 3 === 1 ? 'inactive' : 'pending',
  }));
}

const meta: Meta<TableComponent> = {
  title: 'Shared/UI/Table',
  component: TableComponent,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: false },
    rows: { control: false },
  },
};

export default meta;
type Story = StoryObj<TableComponent>;

export const Default: Story = {
  args: { columns: COLUMNS, rows: makeRows(50) },
};

export const TenThousandRows: Story = {
  name: '10 000 rows — virtual scroll',
  args: { columns: COLUMNS, rows: makeRows(10_000) },
};

export const Empty: Story = {
  name: 'Empty state',
  args: { columns: COLUMNS, rows: [] },
};

export const SingleRow: Story = {
  name: 'Single row',
  args: { columns: COLUMNS, rows: makeRows(1) },
};

export const NonSortableColumns: Story = {
  name: 'Non-sortable columns',
  args: {
    columns: COLUMNS.map((c) => ({ ...c, sortable: false })),
    rows: makeRows(20),
  },
};
