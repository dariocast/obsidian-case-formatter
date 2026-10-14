import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');
const context = await esbuild.context({
  entryPoints: ['src/main.ts'],
  bundle: true,
  external: ['obsidian', '@codemirror/state', '@codemirror/commands'],
  format: 'cjs',
  target: 'es2020',
  platform: 'browser',
  outfile: 'main.js',
  sourcemap: watch ? 'inline' : false,
  banner: { js: '/* Case Formatter | MIT License | Built from src/main.ts */' },
  logLevel: 'info',
});
if (watch) await context.watch();
else {
  await context.rebuild();
  await context.dispose();
}
