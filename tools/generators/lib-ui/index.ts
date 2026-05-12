import {
  formatFiles,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { libraryGenerator } from '@nx/angular/generators';

interface LibUiSchema {
  name: string;
  scope?: string;
}

export default async function libUiGenerator(tree: Tree, options: LibUiSchema) {
  const scope = options.scope ?? 'shared';
  const libName = `ui-${options.name}`;
  const directory = `libs/${scope}/${libName}`;

  await libraryGenerator(tree, {
    name: libName,
    directory,
    standalone: true,
    changeDetection: 'OnPush',
    style: 'scss',
    skipTests: false,
    flat: false,
    tags: `scope:${scope},type:ui`,
  });

  const projectConfig = readProjectConfiguration(tree, libName);

  updateProjectConfiguration(tree, libName, {
    ...projectConfig,
    tags: [`scope:${scope}`, 'type:ui'],
  });

  await formatFiles(tree);
}
