import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export type WidgetCategory = 'form' | 'layout' | 'data' | 'feedback';
export type WidgetStatus = 'stable' | 'beta' | 'new';

export interface WidgetEntry {
  id: string;
  name: string;
  description: string;
  category: WidgetCategory;
  status: WidgetStatus;
  importPath: string;
  version: string;
  downloads: number;
}

const WIDGET_CATALOG: WidgetEntry[] = [
  {
    id: 'ui-button',
    name: 'Button',
    description:
      'Accessible button with primary, secondary, ghost, and danger variants. Supports loading and disabled states.',
    category: 'form',
    status: 'stable',
    importPath: '@angular-large-app/shared/ui-button',
    version: '1.0.0',
    downloads: 12_400,
  },
  {
    id: 'ui-input',
    name: 'Input',
    description:
      'Reactive-forms-compatible input with built-in validation display and ControlValueAccessor support.',
    category: 'form',
    status: 'stable',
    importPath: '@angular-large-app/shared/ui-input',
    version: '1.0.0',
    downloads: 9_800,
  },
  {
    id: 'ui-table',
    name: 'Virtual Table',
    description:
      'CDK-powered virtual-scrolled table that handles 10 000+ rows with sorting and filtering.',
    category: 'data',
    status: 'stable',
    importPath: '@angular-large-app/shared/ui-table',
    version: '1.0.0',
    downloads: 7_200,
  },
  {
    id: 'ui-modal',
    name: 'Modal',
    description:
      'CDK Dialog-based modal with focus trap, escape-to-close, and reduced-motion animations.',
    category: 'feedback',
    status: 'stable',
    importPath: '@angular-large-app/shared/ui-modal',
    version: '1.0.0',
    downloads: 6_100,
  },
  {
    id: 'ui-badge',
    name: 'Badge',
    description: 'Compact status indicator for counts and labels with semantic color variants.',
    category: 'feedback',
    status: 'beta',
    importPath: '@angular-large-app/shared/ui-badge',
    version: '0.2.0',
    downloads: 2_300,
  },
  {
    id: 'ui-card',
    name: 'Card',
    description: 'Composable card container with optional header, body, and footer slots.',
    category: 'layout',
    status: 'new',
    importPath: '@angular-large-app/shared/ui-card',
    version: '0.1.0',
    downloads: 890,
  },
];

const CATEGORY_LABELS: Record<WidgetCategory, string> = {
  form: 'Form',
  layout: 'Layout',
  data: 'Data',
  feedback: 'Feedback',
};

const STATUS_CLASSES: Record<WidgetStatus, string> = {
  stable: 'bg-success/10 text-success',
  beta: 'bg-warning/10 text-warning',
  new: 'bg-primary/10 text-primary',
};

@Component({
  standalone: true,
  selector: 'app-widget-catalog',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <header class="mb-6">
        <h1 class="text-2xl font-bold text-text-primary">Widget Catalog</h1>
        <p class="mt-1 text-sm text-text-secondary">
          {{ filteredWidgets().length }} of {{ allWidgets.length }} components
        </p>
      </header>

      <div class="mb-4 flex flex-wrap gap-2">
        <button
          (click)="setFilter(null)"
          [class]="
            activeFilter() === null
              ? 'bg-primary text-white'
              : 'bg-surface border border-border text-text-secondary hover:border-primary'
          "
          class="rounded-full px-4 py-1 text-sm transition-colors"
        >
          All
        </button>
        @for (cat of categories; track cat) {
        <button
          (click)="setFilter(cat)"
          [class]="
            activeFilter() === cat
              ? 'bg-primary text-white'
              : 'bg-surface border border-border text-text-secondary hover:border-primary'
          "
          class="rounded-full px-4 py-1 text-sm transition-colors"
        >
          {{ categoryLabel(cat) }}
        </button>
        }
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (widget of filteredWidgets(); track widget.id) {
        <article class="rounded-lg border border-border bg-surface p-4 flex flex-col gap-3">
          <div class="flex items-start justify-between">
            <h2 class="font-semibold text-text-primary">{{ widget.name }}</h2>
            <span
              class="rounded-full px-2 py-0.5 text-xs font-medium capitalize"
              [class]="statusClass(widget.status)"
              >{{ widget.status }}</span
            >
          </div>
          <p class="flex-1 text-sm text-text-secondary">{{ widget.description }}</p>
          <footer
            class="flex items-center justify-between text-xs text-text-tertiary border-t border-border pt-3"
          >
            <span>v{{ widget.version }}</span>
            <span>{{ widget.downloads | number }} downloads</span>
          </footer>
        </article>
        }
      </div>

      @if (filteredWidgets().length === 0) {
      <p class="mt-12 text-center text-text-secondary">No widgets in this category yet.</p>
      }
    </div>
  `,
})
export class WidgetCatalogComponent {
  protected readonly allWidgets = WIDGET_CATALOG;
  protected readonly categories: WidgetCategory[] = ['form', 'layout', 'data', 'feedback'];

  protected readonly activeFilter = signal<WidgetCategory | null>(null);

  protected readonly filteredWidgets = computed(() => {
    const filter = this.activeFilter();
    return filter === null ? this.allWidgets : this.allWidgets.filter((w) => w.category === filter);
  });

  protected setFilter(category: WidgetCategory | null): void {
    this.activeFilter.set(category);
  }

  protected categoryLabel(category: WidgetCategory): string {
    return CATEGORY_LABELS[category];
  }

  protected statusClass(status: WidgetStatus): string {
    return STATUS_CLASSES[status];
  }
}
