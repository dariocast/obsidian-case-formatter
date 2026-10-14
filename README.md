# Case Formatter

Change the case of selected text in Obsidian with four familiar actions, available from the command palette, keyboard shortcuts, and the editor context menu.

| Command | Result for `the LORD of the RINGS` |
| --- | --- |
| UPPERCASE | `THE LORD OF THE RINGS` |
| lowercase | `the lord of the rings` |
| Sentence case | `The lord of the rings` |
| Capitalize Each Word | `The Lord Of The Rings` |

These operations follow the general definitions used by [Microsoft Word](https://support.microsoft.com/en-us/word/change-the-capitalization-or-case-of-text). The plugin does not reproduce Office's linguistic engine.

## Manual installation

Requires **Obsidian 1.5.0 or later**. The plugin uses APIs available on desktop and mobile; start with a manual test on desktop. It is not yet listed in the community plugin directory.

1. Download the ZIP from the [Releases page](https://github.com/dariocast/obsidian-case-formatter/releases/latest) and extract it. It contains a `case-formatter` folder. If you built the project locally, the ZIP is at `dist/case-formatter-1.0.1.zip`.
2. Open your vault folder. Copy `case-formatter` into `.obsidian/plugins/`, creating `plugins` if needed. You can also copy the already extracted `dist/case-formatter` folder from a local build.
3. Check that the two required files are at these exact paths:

   ```text
   YOUR-VAULT/
   └── .obsidian/
       └── plugins/
           └── case-formatter/
               ├── main.js
               └── manifest.json
   ```

4. Restart Obsidian. Open **Settings → Community plugins**. Enable community plugins if needed, then turn on **Case Formatter** in the installed plugins list.
5. Open a note in editing mode, select some text, and right-click to see the four actions grouped in the menu. You can also open the command palette and search for **Case Formatter**.

On macOS, folders starting with a dot are hidden: press **⌘⇧.** in Finder to show them. If your vault uses a configuration folder other than `.obsidian`, use that folder instead.

Installation does not require Node.js, npm, or compilation. No `styles.css` is needed because the plugin uses Obsidian's native interface.

## Keyboard shortcuts

Open **Settings → Hotkeys**, search for **Case Formatter**, and assign your preferred shortcuts to the four commands. No default hotkeys are assigned.

## Behavior

- Only selected text is modified, in Source mode and Live Preview. Switch to editing mode first if you are in Reading view.
- Without a selection, the commands are unavailable and the plugin adds no context menu items.
- Converted text stays selected, so you can apply another case without selecting it again.
- Multiple selections and accented letters are supported. Selection positions are updated even when the text length changes, such as `straße` → `STRASSE`.
- Each conversion that changes the text creates one step in the native history. **⌘Z** on Mac or **Ctrl+Z** on Windows/Linux undoes the last conversion; the standard Redo command restores it. There is no separate history.
- **Capitalize Each Word** uppercases the first letter of every word, including articles and prepositions, and lowercases the rest. Internal apostrophes stay within a word (`L'AMICO` → `L'amico`, `DON'T` → `Don't`); hyphens separate words (`mother-in-law` → `Mother-In-Law`).
- **Sentence case** lowercases the text and capitalizes the beginning of sentences and each line. It does not recognize proper names or acronyms: `NASA` becomes `nasa` unless it starts a sentence. Abbreviations and sentence endings are not distinguished using linguistic rules and may need manual correction.
- The plugin converts the **literal selected Markdown**. If your selection includes URLs, link destinations, wikilinks, or code, their letters are converted too: select only the text you want to change.
- No network requests, telemetry, saved settings, or changes to unselected notes.

## Quick test

Copy [TEST-NOTE.md](TEST-NOTE.md) into your vault and follow its checklist. It includes English text, Unicode examples, accents, apostrophes, and Undo/Redo checks. Automated tests cover conversions, selection handling, CodeMirror history, Obsidian host integration, and release packaging.

Desktop acceptance checks have also passed in Obsidian **1.14.4** on macOS, including both editor modes, native Undo/Redo, the visible context menu and mouse conversion, unload cleanup, and an assigned keyboard shortcut. The minimum declared version, **1.5.0**, is based on the public APIs used; it has not been tested in that older runtime. Mobile devices have not been tested.

To update an installed copy, disable the plugin, replace `main.js` and `manifest.json`, then restart Obsidian and enable it again. To remove it, disable the plugin and delete the `case-formatter` folder from your vault.

## Development

Requires **Node.js 22.12+** and npm. Packaging also requires the `zip` command, which is included with macOS. On Ubuntu, install it with `sudo apt install zip`.

```sh
npm ci
npm run lint        # Official Obsidian lint rules and manifest validation
npm run check       # Lint, tests, TypeScript checks, and production build
npm run package     # Checks, installable folder, and ZIP archive
npm run dev         # Rebuild main.js when source files change
```

The build generates `main.js` in the project root. Packaging generates `dist/case-formatter/` and `dist/case-formatter-1.0.1.zip`. Generated files and `node_modules` are excluded from Git. `npm run dev` rebuilds the bundle but does not automatically reload Obsidian.

```text
src/format.ts       Conversion rules with no Obsidian dependencies
src/editor.ts       Atomic selection changes and position updates
src/history.ts      Separate undo events for conversions
src/main.ts         Commands, context menu, and extension registration
tests/              Vitest tests using real CodeMirror history
scripts/package.mjs Installable package and version consistency checks
```

CI runs checks and packaging on Node.js 22 and 24, making the package available as a workflow artifact. Published installable packages are available on the [Releases page](https://github.com/dariocast/obsidian-case-formatter/releases).

For live desktop acceptance, create a disposable vault at `test-vault/`, install the current build there, enable it, and open an editable `Acceptance.md` note. With Obsidian CLI enabled and its debugger attached (`obsidian vault=test-vault dev:debug on`), run `npm run test:obsidian`. This edits the test note, temporarily assigns a shortcut, and disables/re-enables the plugin; it checks the exact vault path before editing. It is intentionally separate from CI.

See [the submission checklist](https://github.com/dariocast/obsidian-case-formatter/blob/main/docs/COMMUNITY-SUBMISSION.md) for release requirements and the naming decision. New release tags must match the manifest version exactly, such as `1.0.1`, without a `v` prefix.

## License

MIT — see [LICENSE](LICENSE).
