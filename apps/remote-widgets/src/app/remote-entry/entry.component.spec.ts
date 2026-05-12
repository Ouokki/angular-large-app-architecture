import { TestBed } from '@angular/core/testing';
import { RemoteEntryComponent } from './entry.component';

describe('RemoteEntryComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoteEntryComponent],
    }).compileComponents();
  });

  it('renders the widget catalog', () => {
    const fixture = TestBed.createComponent(RemoteEntryComponent);
    fixture.detectChanges();
    const catalog = fixture.nativeElement.querySelector('app-widget-catalog');
    expect(catalog).toBeTruthy();
  });
});
