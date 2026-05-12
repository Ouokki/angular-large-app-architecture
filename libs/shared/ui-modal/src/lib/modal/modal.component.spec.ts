import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  describe('standalone usage (no dialog context)', () => {
    let spectator: Spectator<ModalComponent>;

    const createComponent = createComponentFactory({
      component: ModalComponent,
      providers: [
        { provide: DIALOG_DATA, useValue: null },
        { provide: DialogRef, useValue: null },
      ],
    });

    beforeEach(() => {
      spectator = createComponent({
        props: { title: 'Test Modal', confirmLabel: 'OK', cancelLabel: 'Close' },
      });
    });

    it('renders title from input', () => {
      expect(spectator.query('h2')?.textContent?.trim()).toBe('Test Modal');
    });

    it('renders confirm button', () => {
      const buttons = spectator.queryAll('button');
      const labels = buttons.map((b) => b.textContent?.trim());
      expect(labels).toContain('OK');
    });

    it('renders cancel button by default', () => {
      const buttons = spectator.queryAll('button');
      const labels = buttons.map((b) => b.textContent?.trim());
      expect(labels).toContain('Close');
    });

    it('hides cancel button when hideCancel is true', () => {
      spectator.setInput('hideCancel', true);
      spectator.detectChanges();
      const buttons = spectator.queryAll('button');
      expect(buttons.length).toBe(1);
    });

    it('emits confirmed when confirm button is clicked', () => {
      const spy = jest.fn();
      spectator.component.confirmed.subscribe(spy);
      const buttons = spectator.queryAll('button');
      const confirm = buttons.find((b) => b.textContent?.trim() === 'OK') as
        | HTMLElement
        | undefined;
      confirm?.click();
      expect(spy).toHaveBeenCalled();
    });

    it('emits cancelled when cancel button is clicked', () => {
      const spy = jest.fn();
      spectator.component.cancelled.subscribe(spy);
      const buttons = spectator.queryAll('button');
      const cancel = buttons.find((b) => b.textContent?.trim() === 'Close') as
        | HTMLElement
        | undefined;
      cancel?.click();
      expect(spy).toHaveBeenCalled();
    });

    it('emits cancelled on Escape key', () => {
      const spy = jest.fn();
      spectator.component.cancelled.subscribe(spy);
      spectator.component['onEscape']();
      expect(spy).toHaveBeenCalled();
    });

    it('has aria-modal attribute', () => {
      expect(spectator.query('[aria-modal="true"]')).toBeTruthy();
    });

    it('has role=dialog', () => {
      expect(spectator.query('[role="dialog"]')).toBeTruthy();
    });
  });

  describe('dialog context (data injection)', () => {
    const mockData = {
      title: 'Injected Title',
      message: 'Are you sure?',
      confirmLabel: 'Yes',
      cancelLabel: 'No',
    };

    let spectator: Spectator<ModalComponent>;
    const mockDialogRef = { close: jest.fn() };

    const createComponent = createComponentFactory({
      component: ModalComponent,
      providers: [
        { provide: DIALOG_DATA, useValue: mockData },
        { provide: DialogRef, useValue: mockDialogRef },
      ],
    });

    beforeEach(() => {
      mockDialogRef.close.mockClear();
      spectator = createComponent();
    });

    it('renders title from DIALOG_DATA', () => {
      expect(spectator.query('h2')?.textContent?.trim()).toBe('Injected Title');
    });

    it('renders message from DIALOG_DATA', () => {
      expect(spectator.query('p')?.textContent?.trim()).toBe('Are you sure?');
    });

    it('closes dialog with true on confirm', () => {
      spectator.component['onConfirm']();
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it('closes dialog with false on cancel', () => {
      spectator.component['onCancel']();
      expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });
  });
});
