import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let spectator: Spectator<ButtonComponent>;
  const createComponent = createComponentFactory({
    component: ButtonComponent,
    imports: [],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('renders a <button> element', () => {
    expect(spectator.query('button')).toBeTruthy();
  });

  it('emits clicked event when clicked', () => {
    const clickSpy = jest.fn();
    spectator.component.clicked.subscribe(clickSpy);
    spectator.click('button');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('does not emit clicked when disabled', () => {
    spectator.setInput('disabled', true);
    spectator.detectChanges();
    const clickSpy = jest.fn();
    spectator.component.clicked.subscribe(clickSpy);
    spectator.click('button');
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('does not emit clicked when loading', () => {
    spectator.setInput('loading', true);
    spectator.detectChanges();
    const clickSpy = jest.fn();
    spectator.component.clicked.subscribe(clickSpy);
    spectator.click('button');
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('shows spinner when loading', () => {
    spectator.setInput('loading', true);
    spectator.detectChanges();
    expect(spectator.query('svg.animate-spin')).toBeTruthy();
  });

  it('hides spinner when not loading', () => {
    spectator.setInput('loading', false);
    spectator.detectChanges();
    expect(spectator.query('svg.animate-spin')).toBeNull();
  });

  it('sets aria-busy when loading', () => {
    spectator.setInput('loading', true);
    spectator.detectChanges();
    expect(spectator.query('button')?.getAttribute('aria-busy')).toBe('true');
  });

  it('sets aria-disabled when disabled', () => {
    spectator.setInput('disabled', true);
    spectator.detectChanges();
    expect(spectator.query('button')?.getAttribute('aria-disabled')).toBe('true');
  });

  it('passes aria-label to the button element', () => {
    spectator.setInput('ariaLabel', 'Close dialog');
    spectator.detectChanges();
    expect(spectator.query('button')?.getAttribute('aria-label')).toBe('Close dialog');
  });

  it('applies primary variant classes by default', () => {
    expect(spectator.query('button')?.className).toContain('bg-primary-600');
  });

  it('applies danger variant classes', () => {
    spectator.setInput('variant', 'danger');
    spectator.detectChanges();
    expect(spectator.query('button')?.className).toContain('bg-danger-500');
  });

  it('applies sm size classes', () => {
    spectator.setInput('size', 'sm');
    spectator.detectChanges();
    expect(spectator.query('button')?.className).toContain('text-sm');
  });

  it('applies lg size classes', () => {
    spectator.setInput('size', 'lg');
    spectator.detectChanges();
    expect(spectator.query('button')?.className).toContain('text-lg');
  });

  it('passes the type attribute to the native button', () => {
    spectator.setInput('type', 'submit');
    spectator.detectChanges();
    expect(spectator.query('button')?.getAttribute('type')).toBe('submit');
  });
});
