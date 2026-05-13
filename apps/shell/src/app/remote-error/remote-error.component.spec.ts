import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RemoteErrorComponent } from './remote-error.component';

describe('RemoteErrorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoteErrorComponent, RouterModule.forRoot([])],
    }).compileComponents();
  });

  it('renders the error heading', () => {
    const fixture = TestBed.createComponent(RemoteErrorComponent);
    fixture.detectChanges();
    const h2 = (fixture.nativeElement as HTMLElement).querySelector('h2');
    expect(h2?.textContent?.trim()).toBe('Widget catalog could not be loaded');
  });

  it('renders a link back to dashboard', () => {
    const fixture = TestBed.createComponent(RemoteErrorComponent);
    fixture.detectChanges();
    const link = (fixture.nativeElement as HTMLElement).querySelector('a');
    expect(link?.getAttribute('href')).toContain('dashboard');
  });
});
