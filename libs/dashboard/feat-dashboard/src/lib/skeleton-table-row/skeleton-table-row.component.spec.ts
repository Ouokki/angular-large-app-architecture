import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SkeletonTableRowComponent } from './skeleton-table-row.component';

describe('SkeletonTableRowComponent', () => {
  let spectator: Spectator<SkeletonTableRowComponent>;

  const createComponent = createComponentFactory(SkeletonTableRowComponent);

  beforeEach(() => (spectator = createComponent()));

  it('renders without error', () => {
    expect(spectator.query('.skeleton-row')).toBeTruthy();
  });

  it('renders 5 skeleton cells', () => {
    expect(spectator.queryAll('.skeleton-cell').length).toBe(5);
  });

  it('has aria-hidden to hide from assistive technology', () => {
    expect(spectator.query('[aria-hidden="true"]')).toBeTruthy();
  });
});
