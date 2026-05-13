import { Injectable } from '@angular/core';
import { UserSettings } from './+state/settings.model';

type AppTheme = UserSettings['theme'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  apply(theme: AppTheme): void {
    document.documentElement.dataset['theme'] = theme;
    document.body.dataset['theme'] = theme;
  }
}
