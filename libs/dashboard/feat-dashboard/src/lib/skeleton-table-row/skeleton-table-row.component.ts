import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-table-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="skeleton-row" aria-hidden="true">
      @for (col of cols; track col) {
      <div class="skeleton-cell"></div>
      }
    </div>
  `,
  styles: [
    `
      .skeleton-row {
        display: grid;
        grid-template-columns: 60px 1fr 1fr 1fr 1fr;
        gap: 1rem;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--mat-sys-outline-variant, #e0e0e0);
        align-items: center;
      }

      .skeleton-cell {
        height: 14px;
        border-radius: 4px;
        background: linear-gradient(
          90deg,
          var(--skeleton-base, #e0e0e0) 25%,
          var(--skeleton-highlight, #f5f5f5) 50%,
          var(--skeleton-base, #e0e0e0) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }

      .skeleton-cell:nth-child(even) {
        animation-delay: 0.2s;
      }

      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
    `,
  ],
})
export class SkeletonTableRowComponent {
  protected readonly cols = [1, 2, 3, 4, 5];
}
