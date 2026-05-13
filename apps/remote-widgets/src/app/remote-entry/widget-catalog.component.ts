import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

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
  stable: 'status-stable',
  beta: 'status-beta',
  new: 'status-new',
};

@Component({
  standalone: true,
  selector: 'app-widget-catalog',
  imports: [DecimalPipe, MatButtonModule, MatCardModule, MatChipsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="catalog-page">
      <header class="catalog-hero">
        <div>
          <p class="eyebrow">Remote library</p>
          <h1>Widget Catalog</h1>
          <p class="hero-subtitle">
            Curated standalone UI packages exposed by the remote widgets application.
          </p>
        </div>
        <div class="catalog-count">
          <span>Components</span>
          <strong>{{ filteredWidgets().length }}/{{ allWidgets.length }}</strong>
        </div>
      </header>

      <div class="filter-row" aria-label="Widget category filters">
        <button
          mat-button
          (click)="setFilter(null)"
          class="filter-button"
          [class.filter-active]="activeFilter() === null"
        >
          All
        </button>
        @for (cat of categories; track cat) {
        <button
          mat-button
          (click)="setFilter(cat)"
          class="filter-button"
          [class.filter-active]="activeFilter() === cat"
        >
          {{ categoryLabel(cat) }}
        </button>
        }
      </div>

      <section class="widget-grid" aria-label="Available widgets">
        @for (widget of filteredWidgets(); track widget.id) {
        <mat-card class="widget-card" appearance="outlined">
          <div class="widget-card-header">
            <div>
              <p>{{ categoryLabel(widget.category) }}</p>
              <h2>{{ widget.name }}</h2>
            </div>
            <mat-chip [class]="statusClass(widget.status)">{{ widget.status }}</mat-chip>
          </div>
          <p class="widget-description">{{ widget.description }}</p>
          <code>{{ widget.importPath }}</code>
          <footer>
            <span>Version {{ widget.version }}</span>
            <strong>{{ widget.downloads | number }} downloads</strong>
          </footer>
        </mat-card>
        }
      </section>

      @if (filteredWidgets().length === 0) {
      <p class="empty-state">No widgets in this category yet.</p>
      }
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .catalog-page {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        margin: 0 auto;
        max-width: 1440px;
        padding: 1.5rem 2rem 2rem;
      }

      .catalog-hero {
        align-items: stretch;
        background: linear-gradient(135deg, rgb(15 23 42 / 0.94), rgb(30 41 59 / 0.92)),
          linear-gradient(135deg, #0f766e, #4f46e5);
        border-radius: 0.75rem;
        box-shadow: 0 20px 45px rgb(15 23 42 / 0.16);
        color: #fff;
        display: flex;
        gap: 1rem;
        justify-content: space-between;
        padding: 1.5rem;
      }

      .eyebrow {
        color: #2dd4bf;
        font-size: 0.72rem;
        font-weight: 850;
        letter-spacing: 0;
        margin: 0;
        text-transform: uppercase;
      }

      h1 {
        font-size: 2rem;
        font-weight: 900;
        line-height: 1;
        margin: 0.2rem 0 0.5rem;
      }

      .hero-subtitle {
        color: #cbd5e1;
        margin: 0;
        max-width: 42rem;
      }

      .catalog-count {
        background: rgb(255 255 255 / 0.09);
        border: 1px solid rgb(255 255 255 / 0.12);
        border-radius: 0.65rem;
        display: grid;
        min-width: 150px;
        padding: 0.9rem;
      }

      .catalog-count span {
        color: #94a3b8;
        font-size: 0.72rem;
        font-weight: 850;
        text-transform: uppercase;
      }

      .catalog-count strong {
        color: #fff;
        font-size: 1.4rem;
        font-weight: 900;
      }

      .filter-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .filter-button.mat-mdc-button {
        border: 1px solid #dbe3ec;
        border-radius: 999px;
        color: #475569;
        font-weight: 800;
      }

      .filter-button.filter-active {
        background: #0f172a;
        color: #fff;
      }

      .widget-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }

      .widget-card.mat-mdc-card {
        background: #fff;
        border-color: #dbe3ec;
        border-radius: 0.75rem;
        box-shadow: 0 14px 34px rgb(15 23 42 / 0.07);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .widget-card-header {
        align-items: flex-start;
        display: flex;
        gap: 1rem;
        justify-content: space-between;
      }

      .widget-card-header p {
        color: #0f766e;
        font-size: 0.72rem;
        font-weight: 850;
        margin: 0 0 0.25rem;
        text-transform: uppercase;
      }

      h2 {
        color: #0f172a;
        font-size: 1.05rem;
        font-weight: 900;
        margin: 0;
      }

      .widget-description {
        color: #64748b;
        flex: 1;
        line-height: 1.55;
        margin: 0;
      }

      code {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 0.45rem;
        color: #334155;
        display: block;
        font-size: 0.78rem;
        overflow: hidden;
        padding: 0.65rem;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      footer {
        align-items: center;
        border-top: 1px solid #e2e8f0;
        color: #64748b;
        display: flex;
        font-size: 0.78rem;
        justify-content: space-between;
        padding-top: 0.85rem;
      }

      footer strong {
        color: #0f172a;
      }

      .status-stable {
        --mdc-chip-elevated-container-color: #dcfce7;
        --mdc-chip-label-text-color: #166534;
      }

      .status-beta {
        --mdc-chip-elevated-container-color: #fef3c7;
        --mdc-chip-label-text-color: #92400e;
      }

      .status-new {
        --mdc-chip-elevated-container-color: #eef2ff;
        --mdc-chip-label-text-color: #4338ca;
      }

      .empty-state {
        color: #64748b;
        padding: 3rem;
        text-align: center;
      }

      :host-context(body[data-theme='dark']) .catalog-page {
        color: #f8fafc;
      }

      :host-context(body[data-theme='dark']) .filter-button.mat-mdc-button {
        border-color: #3e4652;
        color: #cbd5e1;
      }

      :host-context(body[data-theme='dark']) .filter-button.filter-active {
        background: #2dd4bf;
        color: #062f2c;
      }

      :host-context(body[data-theme='dark']) .widget-card.mat-mdc-card {
        background: #202329;
        border-color: #3e4652;
        box-shadow: 0 18px 42px rgb(0 0 0 / 0.22);
        color: #f8fafc;
      }

      :host-context(body[data-theme='dark']) h2,
      :host-context(body[data-theme='dark']) footer strong {
        color: #f8fafc;
      }

      :host-context(body[data-theme='dark']) .widget-description,
      :host-context(body[data-theme='dark']) footer,
      :host-context(body[data-theme='dark']) .empty-state {
        color: #b5bfca;
      }

      :host-context(body[data-theme='dark']) code {
        background: #15181d;
        border-color: #3e4652;
        color: #d6dee8;
      }

      :host-context(body[data-theme='dark']) footer {
        border-top-color: #3e4652;
      }

      @media (max-width: 720px) {
        .catalog-page {
          padding: 1rem;
        }

        .catalog-hero {
          flex-direction: column;
        }
      }
    `,
  ],
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
