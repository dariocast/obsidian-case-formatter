# Case Formatter Implementation Plan

> **For agentic workers:** execute inline with the executing-plans skill; the user requested completion without further checkpoints.

**Goal:** Deliver an installable Obsidian plugin for four capitalization operations.

**Architecture:** Pure transformations in src/format.ts; selection transactions in src/editor.ts; isolated undo extension in src/history.ts; host registration in src/main.ts. Commands and menu share one conversion path.

**Tech Stack:** TypeScript, Obsidian public API, CodeMirror 6, esbuild, Vitest.

### Task 1: Conversion rules
- [x] Add tests/format.test.ts covering the four expected examples, accents, apostrophes, hyphens, sentences, paragraphs, whitespace and empty input.
- [x] Run `npm test -- tests/format.test.ts`; confirm missing implementation fails.
- [x] Implement src/format.ts; rerun and confirm passing results.

### Task 2: Selection and native undo
- [x] Add tests/editor.test.ts against an editor backed by a real CodeMirror state; verify selection preservation, backwards selection, expanding Unicode, multi-selection, no selection/no-op, undo/redo and adjacent typing boundaries.
- [x] Run targeted tests before implementing src/editor.ts and src/history.ts, then implement and verify.

### Task 3: Host integration
- [x] Add tests/plugin.test.ts and tests/obsidian-mock.ts, checking four registrations, selection-only availability, shared command/menu results and registered event/extension lifecycle.
- [x] Run tests before implementing src/main.ts; implement and rerun.

### Task 4: Delivery
- [x] Add scripts/package.mjs, README.md, LICENSE, CHANGELOG.md, TEST-NOTE.md and .github/workflows/ci.yml.
- [x] Run `npm run package`; inspect bundle imports and ZIP contents, review code against spec, and initialize a local Git repository.
- [x] Report paths and installation instructions. Do not create a remote or push.
