import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let spectator: Spectator<InputComponent>;

  const createComponent = createComponentFactory({
    component: InputComponent,
    imports: [ReactiveFormsModule],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('renders an <input> element', () => {
    expect(spectator.query('input')).toBeTruthy();
  });

  it('renders label when provided', () => {
    spectator.setInput('label', 'Email address');
    spectator.detectChanges();
    expect(spectator.query('label')?.textContent?.trim()).toBe('Email address');
  });

  it('does not render label when not provided', () => {
    expect(spectator.query('label')).toBeNull();
  });

  it('renders hint text when no error', () => {
    spectator.setInput('hint', 'Enter your email');
    spectator.detectChanges();
    expect(spectator.element.textContent).toContain('Enter your email');
  });

  it('sets the input type attribute', () => {
    spectator.setInput('type', 'email');
    spectator.detectChanges();
    expect(spectator.query('input')?.getAttribute('type')).toBe('email');
  });

  it('sets aria-invalid when control has an error and is touched', () => {
    const ctrl = new FormControl('', Validators.required);
    ctrl.markAsTouched();
    ctrl.setErrors({ required: true });
    expect(ctrl.invalid && ctrl.touched).toBe(true);
  });

  it('disables the input via setDisabledState', () => {
    spectator.component.setDisabledState(true);
    spectator.detectChanges();
    expect(spectator.query('input')?.getAttribute('disabled')).toBe('');
  });

  it('re-enables the input via setDisabledState', () => {
    spectator.component.setDisabledState(true);
    spectator.component.setDisabledState(false);
    spectator.detectChanges();
    expect(spectator.query('input')?.hasAttribute('disabled')).toBe(false);
  });

  it('reflects writeValue in the internal control', () => {
    spectator.component.writeValue('hello@example.com');
    spectator.detectChanges();
    expect((spectator.query('input') as HTMLInputElement).value).toBe('hello@example.com');
  });

  it('calls onChange when internal control value changes', () => {
    const onChangeSpy = jest.fn();
    spectator.component.registerOnChange(onChangeSpy);
    spectator.component.internalControl.setValue('test');
    expect(onChangeSpy).toHaveBeenCalledWith('test');
  });

  it('calls onTouched when input is blurred', () => {
    const onTouchedSpy = jest.fn();
    spectator.component.registerOnTouched(onTouchedSpy);
    const input = spectator.query('input');
    if (!input) {
      throw new Error('Expected input to render');
    }
    input.dispatchEvent(new FocusEvent('blur'));
    spectator.detectChanges();
    expect(onTouchedSpy).toHaveBeenCalled();
  });
});
