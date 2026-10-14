# Validation — 2026-10-14

- 24 automated tests: Word-style examples, Unicode, punctuation, apostrophes, fallback sentence segmentation, forward/backward/multiline/multiple selections, expanding text, no-ops, real CodeMirror undo/redo boundaries and Obsidian host integration.
- TypeScript strict typecheck and production CommonJS bundle generation.
- Packaged bundle loaded in a Node VM with a minimal Obsidian host and real CodeMirror modules; four commands, editor-menu hook and history extension registered.
- ZIP integrity and file layout checked. Obsidian and CodeMirror remain external runtime dependencies.
- npm audit: zero known vulnerabilities at verification time.
- Independent read-only review: no actionable correctness findings. Added multiline selection coverage following the review.

Not yet verified in the actual Obsidian UI: command palette, assigned hotkeys, context menu, Live Preview/Source mode, disabling the plugin, oldest declared host version and mobile. See TEST-NOTE.md for manual acceptance.

Repository created locally only. No GitHub repository or remote push.
