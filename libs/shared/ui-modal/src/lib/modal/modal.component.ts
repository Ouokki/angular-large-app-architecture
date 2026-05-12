import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  input,
  output,
} from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { A11yModule } from '@angular/cdk/a11y';

export interface ModalData {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

@Component({
  selector: 'app-ui-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A11yModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  readonly title = input('');
  readonly confirmLabel = input('Confirm');
  readonly cancelLabel = input('Cancel');
  readonly hideCancel = input(false);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected readonly dialogRef = inject(DialogRef, { optional: true });
  protected readonly data = inject<ModalData>(DIALOG_DATA, { optional: true });

  protected get resolvedTitle(): string {
    return this.data?.title ?? this.title();
  }

  protected get resolvedMessage(): string | undefined {
    return this.data?.message;
  }

  protected get resolvedConfirmLabel(): string {
    return this.data?.confirmLabel ?? this.confirmLabel();
  }

  protected get resolvedCancelLabel(): string {
    return this.data?.cancelLabel ?? this.cancelLabel();
  }

  protected onConfirm(): void {
    this.confirmed.emit();
    this.dialogRef?.close(true);
  }

  protected onCancel(): void {
    this.cancelled.emit();
    this.dialogRef?.close(false);
  }

  @HostListener('keydown.escape')
  protected onEscape(): void {
    this.onCancel();
  }
}
