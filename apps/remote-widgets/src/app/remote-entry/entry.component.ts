import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WidgetCatalogComponent } from './widget-catalog.component';

@Component({
  standalone: true,
  imports: [WidgetCatalogComponent],
  selector: 'app-remote-widgets-entry',
  template: `<app-widget-catalog />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoteEntryComponent {}
