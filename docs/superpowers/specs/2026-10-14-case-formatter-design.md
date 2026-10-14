# Case Formatter — approved design

Approved in conversation on 2026-10-14; the user authorized full implementation and packaging without further checkpoints.

- One Obsidian plugin, four editor commands: UPPERCASE, lowercase, Sentence case, Capitalize Each Word.
- All commands appear in the editor context menu when there is selected text. Use documented APIs and a dedicated menu section, avoiding private submenu APIs.
- Commands accept user-assigned hotkeys, with no defaults.
- Work on selected text only, including multiple selections. Preserve selection after conversion, including Unicode length changes.
- Word-like capitalization: first letter of each word uppercase, others lowercase. Apostrophes within a word stay within that word; hyphens separate words. No editorial stopword lists.
- Sentence case lowercases text and capitalizes the first letter of each sentence and paragraph. Unicode sentence segmentation is used when available, with a punctuation-based fallback. Names/acronyms are not recognized. Exact replication of all Word linguistic rules is outside scope.
- Transform the literal selected Markdown, including link targets and code if selected; do not parse or rewrite the rest of the note.
- Each conversion is a native undo event isolated from adjacent typing and other conversions. No custom history, persistence, network requests or telemetry.
- TypeScript with esbuild; Obsidian and CodeMirror are provided by the host and remain external.
- Deliver compiled main.js and manifest.json in dist/case-formatter plus a ZIP, README in Italian, test note, MIT license, CI, and local source repository. No remote creation or push until the user verifies the plugin.

Validation: unit tests of conversion rules, real CodeMirror history tests, editor transaction/selection tests, plugin integration tests with a minimal host double, typecheck, production bundle inspection, archive inspection. Live Obsidian acceptance remains a user verification step.
