import {
  formatFiles,
  generateFiles,
  names,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { libraryGenerator } from '@nx/angular/generators';
import * as path from 'path';

interface LibFeatSchema {
  name: string;
  scope: string;
  directory?: string;
}

export default async function libFeatGenerator(tree: Tree, options: LibFeatSchema) {
  const libName = `feat-${options.name}`;
  const directory = options.directory ?? `libs/${options.scope}/${libName}`;

  await libraryGenerator(tree, {
    name: libName,
    directory,
    standalone: true,
    changeDetection: 'OnPush',
    style: 'scss',
    skipTests: false,
    flat: false,
    tags: `scope:${options.scope},type:feat`,
  });

  const projectConfig = readProjectConfiguration(tree, libName);

  updateProjectConfiguration(tree, libName, {
    ...projectConfig,
    tags: [`scope:${options.scope}`, 'type:feat'],
  });

  const nameVariants = names(options.name);

  generateFiles(tree, path.join(__dirname, 'files'), directory, {
    ...nameVariants,
    scope: options.scope,
    tmpl: '',
  });

  await formatFiles(tree);
}
