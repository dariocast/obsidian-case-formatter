import { copyFile, mkdir, readFile, rm, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8'));
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const versions = JSON.parse(await readFile(path.join(root, 'versions.json'), 'utf8'));
if (pkg.version !== manifest.version || versions[manifest.version] !== manifest.minAppVersion) {
  throw new Error('package.json, manifest.json and versions.json must agree.');
}
if (manifest.id !== 'case-formatter') throw new Error('Unexpected plugin folder name.');

const destination = path.join(root, 'dist', manifest.id);
await mkdir(destination, { recursive: true });
for (const name of ['main.js', 'manifest.json', 'README.md', 'LICENSE', 'TEST-NOTE.md']) {
  await copyFile(path.join(root, name), path.join(destination, name));
}
const archive = `case-formatter-${manifest.version}.zip`;
await rm(path.join(root, 'dist', archive), { force: true });
execFileSync('zip', ['-q', '-r', archive, manifest.id], { cwd: path.join(root, 'dist') });
const { size } = await stat(path.join(destination, 'main.js'));
console.log(`Plugin: ${destination}`);
console.log(`Archive: ${path.join(root, 'dist', archive)}`);
console.log(`Bundle: ${size} bytes; Obsidian and CodeMirror provided by the host.`);
