import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'remote-widgets',
  exposes: {
    './Routes': 'apps/remote-widgets/src/app/remote-entry/entry.routes.ts',
    './WidgetCatalog': 'apps/remote-widgets/src/app/remote-entry/widget-catalog.component.ts',
  },
};

export default config;
