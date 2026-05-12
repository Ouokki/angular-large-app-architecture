import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const remoteUrl = process.env.REMOTE_WIDGETS_URL ?? 'http://localhost:4201';
const manifestPath = resolve('apps/shell/public/module-federation.manifest.json');
const manifest = {
  'remote-widgets': remoteUrl.replace(/\/$/, ''),
};

await mkdir(dirname(manifestPath), { recursive: true });
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${manifestPath} with remote-widgets=${manifest['remote-widgets']}`);
