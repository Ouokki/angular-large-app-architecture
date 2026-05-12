import { inject, Injectable } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ModalComponent, ModalData } from './modal.component';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly dialog = inject(Dialog);

  open(data: ModalData): DialogRef<boolean, ModalComponent> {
    return this.dialog.open<boolean, ModalData, ModalComponent>(ModalComponent, {
      data,
      hasBackdrop: true,
      backdropClass: 'modal-backdrop',
      panelClass: 'modal-container',
    });
  }
}
