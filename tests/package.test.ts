import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), 'case-formatter-package-'));
  await mkdir(path.join(root, 'scripts'));
  await mkdir(path.join(root, 'dist/case-formatter'), { recursive: true });
  await copyFile('scripts/package.mjs', path.join(root, 'scripts/package.mjs'));
  for (const name of ['package.json', 'manifest.json', 'versions.json', 'README.md', 'LICENSE', 'TEST-NOTE.md']) {
    await copyFile(name, path.join(root, name));
  }
  await writeFile(path.join(root, 'main.js'), '/* test fixture bundle */');
  return root;
}

describe('release packaging', () => {
  it('excludes stale assets from previous builds', async () => {
    const root = await fixture();
    try {
      await writeFile(path.join(root, 'dist/case-formatter/stale.txt'), 'must not ship');
      execFileSync(process.execPath, [path.join(root, 'scripts/package.mjs')]);
      const { version } = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8')) as { version: string };
      const entries = execFileSync('unzip', ['-Z1', path.join(root, `dist/case-formatter-${version}.zip`)], { encoding: 'utf8' });
      expect(entries).not.toContain('stale.txt');
      expect(entries).toContain('case-formatter/main.js');
      expect(entries).toContain('case-formatter/manifest.json');
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
  it('refuses a manifest/package version mismatch', async () => {
    const root = await fixture();
    try {
      const file = path.join(root, 'manifest.json');
      const manifest = JSON.parse(await readFile(file, 'utf8')) as { version: string };
      manifest.version = '99.0.0';
      await writeFile(file, JSON.stringify(manifest));
      expect(() => execFileSync(process.execPath, [path.join(root, 'scripts/package.mjs')], { stdio: 'pipe' }))
        .toThrow('package.json, manifest.json and versions.json must agree.');
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
