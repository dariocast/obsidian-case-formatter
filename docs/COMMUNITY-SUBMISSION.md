# Community submission readiness

Prepared on 2026-10-14 for Case Formatter 1.0.1.

## Identity and naming

- Plugin name: **Case Formatter**.
- Plugin ID / installation folder: **case-formatter**.
- Repository: **dariocast/obsidian-case-formatter**.
- Recommended positioning: **Four familiar case conversions from the selection menu, commands, or hotkeys.**

The official [community plugin index](https://github.com/obsidianmd/obsidian-releases/blob/master/community-plugins.json) had no exact `case-formatter` ID or `Case Formatter` name match when checked on 2026-10-14. This is a published-index check, not a reservation or guarantee against pending submissions.

| Option | Assessment |
| --- | --- |
| Case Formatter | Recommended: short, descriptive, searchable, and accurate for the four explicit transformations. |
| Case Switcher | More active wording, but can suggest cycling through cases, which is not a feature. |
| Casecraft | More distinctive as a brand, but less descriptive and harder to discover by function. |

**Change Case**, **Toggle Case**, and **Convert case** already appear in the directory. The repository's `obsidian-` prefix identifies the target app; the plugin's name and ID omit it, as required. No repository rename is recommended.

Related tools exist. This project provides a deliberately small, independently written implementation with four Word-style operations, direct context-menu actions, selection retention, and separate native undo events. No source code was copied from those plugins. These are product choices, not a claim that other plugins lack them.

## Checks completed

- Public source repository; English README, installation instructions, changelog, and manual test note.
- MIT license, recognized by GitHub.
- Valid manifest: descriptive name, lowercase/hyphen ID, description under 250 characters ending with a period, author attribution, SemVer version, and desktop/mobile declaration.
- Official Obsidian ESLint recommended rules, manifest validation, strict TypeScript check, production build, and 26 automated tests.
- Real desktop acceptance in Obsidian 1.14.4 on macOS, including a visible context menu mouse action, an assigned shortcut, both editor modes, selection handling, native undo, and unload cleanup.
- No runtime Node.js/Electron imports, telemetry, network requests, outside-vault access, self-updates, or persisted note contents.
- Runtime dependencies are host-provided Obsidian and CodeMirror modules, kept external to the production bundle.
- Packaging clears its output folder to prevent stale assets and checks version consistency.
- Release tag must be **1.0.1**, exactly matching `manifest.json`, with separate **main.js** and **manifest.json** assets. `styles.css` is unnecessary; the ZIP is an additional manual-install convenience.
- CI builds and packages on Node.js 22 and 24. Build dependencies are locked in `package-lock.json`.

The 1.0.0 preregistration release used the conventional `v1.0.0` tag. The new 1.0.1 release uses the exact version format required by Obsidian. Existing history is preserved.

## Explicit limits

- Physical mobile devices and the declared minimum Obsidian 1.5.0 runtime have not been exercised. Used APIs pass the minimum-version static check; no unsupported API usage was reported.
- Sentence boundaries do not implement Office's linguistic engine or reliably distinguish all abbreviations. Literal selected Markdown, including selected URLs/code, is transformed. Both behaviors are documented in the README.
- Local lint and tests do not guarantee approval. The community directory runs its own manifest, release, source, and build review.

## Submit from the owner account

1. Sign in to [Obsidian Community](https://community.obsidian.md) with an Obsidian account.
2. Connect the GitHub account that owns the repository.
3. Select **Plugins → New plugin**.
4. Set **GitHub repository URL** to `https://github.com/dariocast/obsidian-case-formatter` and choose the owner.
5. Review the developer policies and confirm the maintenance commitment, then submit.
6. Review scanner results. If corrections are needed, publish an incremented version with an exactly matching release tag and assets, then request **Check for new releases**.

Only the owner completes these account and policy confirmations. This preparation does not submit the plugin to the directory.

Official references: [Submit your plugin](https://docs.obsidian.md/plugins/releasing/submit-plugin), [submission requirements](https://docs.obsidian.md/community-directory/submission-requirements-for-plugins), [developer policies](https://docs.obsidian.md/community-directory/developer-policies), and [review FAQ](https://docs.obsidian.md/community-directory/faq).
