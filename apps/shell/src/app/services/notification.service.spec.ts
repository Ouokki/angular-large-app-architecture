import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator/jest';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let spectator: SpectatorService<NotificationService>;
  let snackBar: SpyObject<MatSnackBar>;

  const createService = createServiceFactory({
    service: NotificationService,
    mocks: [MatSnackBar],
  });

  beforeEach(() => {
    spectator = createService();
    snackBar = spectator.inject(MatSnackBar);
  });

  it('success calls snackBar with success panel class', () => {
    spectator.service.success('Saved');
    expect(snackBar.open).toHaveBeenCalledWith(
      'Saved',
      '✕',
      expect.objectContaining({ panelClass: ['notification--success'] }),
    );
  });

  it('error calls snackBar with error panel class and longer duration', () => {
    spectator.service.error('Something broke');
    const calls = (snackBar.open as jest.Mock).mock.calls as [
      string,
      string,
      { duration?: number; panelClass?: string[] },
    ][];
    const config = calls[0][2];
    expect(config.panelClass).toEqual(['notification--error']);
    expect((config.duration ?? 0) > 5000).toBe(true);
  });

  it('info calls snackBar with info panel class', () => {
    spectator.service.info('Loading…');
    expect(snackBar.open).toHaveBeenCalledWith(
      'Loading…',
      '✕',
      expect.objectContaining({ panelClass: ['notification--info'] }),
    );
  });
});
