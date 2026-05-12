import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  host: {
    '[class]': 'hostClass()',
  },
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly clicked = output<MouseEvent>();

  protected hostClass(): string {
    return 'inline-flex';
  }

  protected onClick(event: MouseEvent): void {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.clicked.emit(event);
  }

  protected get variantClasses(): string {
    const map: Record<ButtonVariant, string> = {
      primary:
        'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500' +
        ' disabled:bg-primary-300',
      secondary:
        'bg-neutral-100 text-neutral-900 border border-neutral-300 hover:bg-neutral-200' +
        ' focus-visible:ring-neutral-400 disabled:opacity-50',
      ghost:
        'bg-transparent text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-400' +
        ' disabled:opacity-40',
      danger:
        'bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-500' +
        ' disabled:bg-danger-500/50',
    };
    return map[this.variant()];
  }

  protected get sizeClasses(): string {
    const map: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
    };
    return map[this.size()];
  }
}
