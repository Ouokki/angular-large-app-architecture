import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton-label"></div>
      <div class="skeleton-value"></div>
      <div class="skeleton-trend"></div>
    </div>
  `,
  styles: [
    `
      .skeleton-card {
        padding: 1.5rem;
        border-radius: 0.75rem;
        border: 1px solid var(--mat-sys-outline-variant, #e0e0e0);
        background: var(--skeleton-card-bg, transparent);
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        min-height: 120px;
      }

      :host-context(body[data-theme='dark']) {
        --mat-sys-outline-variant: #3e4652;
        --skeleton-base: #2a3038;
        --skeleton-card-bg: #202329;
        --skeleton-highlight: #39414c;
      }

      .skeleton-label,
      .skeleton-value,
      .skeleton-trend {
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

      .skeleton-label {
        height: 14px;
        width: 60%;
      }

      .skeleton-value {
        height: 32px;
        width: 45%;
      }

      .skeleton-trend {
        height: 12px;
        width: 35%;
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
export class SkeletonCardComponent {}
