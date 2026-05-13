import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  private open(message: string, config: MatSnackBarConfig): void {
    this.snackBar.open(message, '✕', { duration: 5000, ...config });
  }

  success(message: string): void {
    this.open(message, { duration: 4000, panelClass: ['notification--success'] });
  }

  error(message: string): void {
    this.open(message, { duration: 7000, panelClass: ['notification--error'] });
  }

  info(message: string): void {
    this.open(message, { duration: 4000, panelClass: ['notification--info'] });
  }
}
