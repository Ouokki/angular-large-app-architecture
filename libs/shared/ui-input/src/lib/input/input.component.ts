import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

@Component({
  selector: 'app-ui-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor, OnInit {
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input('');
  readonly type = input<InputType>('text');
  readonly id = input<string>(`ui-input-${Math.random().toString(36).slice(2)}`);
  readonly hint = input<string | undefined>(undefined);

  readonly internalControl = new FormControl<string>('');
  protected readonly isDisabled = signal(false);

  private _onChange: (value: string) => void = () => undefined;
  private _onTouched: () => void = () => undefined;

  private ngControl: NgControl | null = null;

  ngOnInit(): void {
    try {
      this.ngControl = inject(NgControl, { optional: true, self: true });
    } catch {
      // no NgControl present — standalone usage
    }
  }

  get errorMessage(): string | null {
    const ctrl = this.ngControl?.control;
    if (!ctrl || !ctrl.invalid || !ctrl.touched) return null;

    const errors = ctrl.errors;
    if (!errors) return null;
    if (errors['required']) return 'This field is required.';
    if (errors['email']) return 'Please enter a valid email address.';
    if (errors['minlength']) {
      const req = errors['minlength'].requiredLength as number;
      return `Minimum ${req} characters required.`;
    }
    if (errors['maxlength']) {
      const req = errors['maxlength'].requiredLength as number;
      return `Maximum ${req} characters allowed.`;
    }
    return 'Invalid value.';
  }

  get hasError(): boolean {
    const ctrl = this.ngControl?.control;
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }

  writeValue(value: string): void {
    this.internalControl.setValue(value ?? '', { emitEvent: false });
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
    this.internalControl.valueChanges.subscribe((v) => this._onChange(v ?? ''));
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
    if (isDisabled) {
      this.internalControl.disable();
    } else {
      this.internalControl.enable();
    }
  }

  protected onBlur(): void {
    this._onTouched();
  }
}
