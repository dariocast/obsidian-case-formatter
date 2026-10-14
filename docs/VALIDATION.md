# Validation — 2026-10-14

- 26 automated tests: Word-style examples, Unicode, punctuation, apostrophes, fallback sentence segmentation, forward/backward/multiline/multiple selections, expanding text, no-ops, real CodeMirror undo/redo boundaries, Obsidian host integration, version consistency and exclusion of stale package files.
- Official Obsidian ESLint recommended rules and manifest validation, with zero warnings allowed.
- TypeScript strict typecheck and production CommonJS bundle generation.
- Packaged bundle loaded in a Node VM with a minimal Obsidian host and real CodeMirror modules; four commands, editor-menu hook and history extension registered.
- ZIP integrity and file layout checked. Obsidian and CodeMirror remain external runtime dependencies.
- npm audit: zero known vulnerabilities at verification time.
- Independent read-only reviews: no formatting/history defects found. Added multiline selection coverage and corrected stale packaging files following the reviews; the packaging regression test failed before the fix and passes after it.

## Desktop acceptance

In a separate, disposable `test-vault` on macOS, Obsidian 1.14.4 passed 45 application-level assertions through `npm run test:obsidian`: all four commands in Source mode and Live Preview; selection retention, multiple Unicode selections, native undo/redo and typing boundaries; editor-menu callbacks and no-selection availability; unload cleanup and re-enabling.

The same script also passed an assigned shortcut using trusted Chromium keyboard events and a visible editor context menu opened and clicked through trusted mouse events. Console/error capture reported no errors. The menu was temporarily forced to DOM rendering for label inspection; this setting was not saved.

Not verified: Obsidian 1.5.0 itself and physical mobile devices. The minimum API check passes for 1.5.0; this is static evidence, not a claim of runtime testing. See TEST-NOTE.md for additional manual acceptance.

At initial delivery, the repository existed locally only. GitHub publication was subsequently authorized by the user.
