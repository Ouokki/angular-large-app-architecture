import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetCatalogComponent } from './widget-catalog.component';

function getButtons(fixture: ComponentFixture<WidgetCatalogComponent>): HTMLButtonElement[] {
  return Array.from(
    (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('button'),
  );
}

describe('WidgetCatalogComponent', () => {
  let fixture: ComponentFixture<WidgetCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetCatalogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetCatalogComponent);
    fixture.detectChanges();
  });

  it('renders all widgets by default', () => {
    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('article');
    expect(cards.length).toBe(6);
  });

  it('renders the heading', () => {
    const h1 = (fixture.nativeElement as HTMLElement).querySelector('h1');
    expect(h1?.textContent?.trim()).toBe('Widget Catalog');
  });

  it('filters widgets when a category button is clicked', () => {
    const formBtn = getButtons(fixture).find((b) => b.textContent?.trim() === 'Form');
    formBtn?.click();
    fixture.detectChanges();

    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('article');
    expect(cards.length).toBe(2);
  });

  it('resets to all widgets when All button is clicked', () => {
    const formBtn = getButtons(fixture).find((b) => b.textContent?.trim() === 'Form');
    formBtn?.click();
    fixture.detectChanges();

    const allBtn = getButtons(fixture).find((b) => b.textContent?.trim() === 'All');
    allBtn?.click();
    fixture.detectChanges();

    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('article');
    expect(cards.length).toBe(6);
  });

  it('filters to one widget for the Layout category', () => {
    const layoutBtn = getButtons(fixture).find((b) => b.textContent?.trim() === 'Layout');
    layoutBtn?.click();
    fixture.detectChanges();

    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('article');
    expect(cards.length).toBe(1);
  });

  it('displays widget status badges including stable, beta, and new', () => {
    const badges = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('span.capitalize'),
    );
    const statuses = badges.map((b) => b.textContent?.trim().toLowerCase());
    expect(statuses).toContain('stable');
    expect(statuses).toContain('beta');
    expect(statuses).toContain('new');
  });
});
