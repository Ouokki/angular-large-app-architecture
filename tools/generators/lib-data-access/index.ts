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

interface LibDataAccessSchema {
  name: string;
  scope: string;
  withNgrx?: boolean;
}

export default async function libDataAccessGenerator(tree: Tree, options: LibDataAccessSchema) {
  const libName = `data-access-${options.name}`;
  const directory = `libs/${options.scope}/${libName}`;

  await libraryGenerator(tree, {
    name: libName,
    directory,
    standalone: true,
    changeDetection: 'OnPush',
    style: 'scss',
    skipTests: false,
    flat: false,
    tags: `scope:${options.scope},type:data-access`,
  });

  const projectConfig = readProjectConfiguration(tree, libName);

  updateProjectConfiguration(tree, libName, {
    ...projectConfig,
    tags: [`scope:${options.scope}`, 'type:data-access'],
  });

  if (options.withNgrx) {
    const nameVariants = names(options.name);

    generateFiles(tree, path.join(__dirname, 'files/ngrx'), directory, {
      ...nameVariants,
      scope: options.scope,
      tmpl: '',
    });
  }

  await formatFiles(tree);
}
