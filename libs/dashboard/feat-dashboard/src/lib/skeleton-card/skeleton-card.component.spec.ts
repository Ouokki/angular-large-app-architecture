import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SkeletonCardComponent } from './skeleton-card.component';

describe('SkeletonCardComponent', () => {
  let spectator: Spectator<SkeletonCardComponent>;

  const createComponent = createComponentFactory(SkeletonCardComponent);

  beforeEach(() => (spectator = createComponent()));

  it('renders without error', () => {
    expect(spectator.query('.skeleton-card')).toBeTruthy();
  });

  it('has aria-hidden to hide from assistive technology', () => {
    expect(spectator.query('[aria-hidden="true"]')).toBeTruthy();
  });
});
