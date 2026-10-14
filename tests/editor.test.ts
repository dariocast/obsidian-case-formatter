import { describe, expect, it } from 'vitest';
import { EditorSelection } from '@codemirror/state';
import { applyCase, hasSelection } from '../src/editor';
import { isolateFormattingHistory } from '../src/history';
import { EditorHarness } from './editor-harness';

describe('editor conversions', () => {
  it('changes only selected text and keeps it selected', () => {
    const h = new EditorHarness('before ciao after', [{ anchor: 7, head: 11 }]);
    expect(applyCase(h.editor, 'upper')).toBe(true);
    expect(h.getValue()).toBe('before CIAO after');
    expect(h.state.selection.main.from).toBe(7);
    expect(h.state.selection.main.to).toBe(11);
    expect(h.transactions).toBe(1);
  });
  it('preserves backwards selections after Unicode expansion', () => {
    const h = new EditorHarness('a straße z', [{ anchor: 8, head: 2 }]);
    applyCase(h.editor, 'upper');
    expect(h.getValue()).toBe('a STRASSE z');
    expect(h.state.selection.main.anchor).toBe(9);
    expect(h.state.selection.main.head).toBe(2);
  });
  it('maps multiple selections and empty carets after expanding text', () => {
    const h = new EditorHarness('ß\nété fin', [{ anchor: 0, head: 1 }, { anchor: 2, head: 5 }, { anchor: 9, head: 9 }]);
    applyCase(h.editor, 'upper');
    expect(h.getValue()).toBe('SS\nÉTÉ fin');
    expect(h.state.selection.ranges.map(r => [r.anchor, r.head])).toEqual([[0, 2], [3, 6], [10, 10]]);
    expect(h.transactions).toBe(1);
    h.undo();
    expect(h.getValue()).toBe('ß\nété fin');
    h.redo();
    expect(h.getValue()).toBe('SS\nÉTÉ fin');
  });
  it('does nothing for no selection or an unchanged conversion', () => {
    const h = new EditorHarness('CIAO', [{ anchor: 2, head: 2 }]);
    expect(hasSelection(h.editor)).toBe(false);
    expect(applyCase(h.editor, 'upper')).toBe(false);
    expect(h.transactions).toBe(0);
    const selected = new EditorHarness('CIAO');
    expect(applyCase(selected.editor, 'upper')).toBe(false);
    expect(selected.transactions).toBe(0);
  });
  it.each([false, true])('preserves multiline selection and surrounding text (backwards=%s)', backwards => {
    const h = new EditorHarness('prefix\nß\nété\nsuffix', [{ anchor: backwards ? 12 : 7, head: backwards ? 7 : 12 }]);
    applyCase(h.editor, 'upper');
    expect(h.getValue()).toBe('prefix\nSS\nÉTÉ\nsuffix');
    expect(h.listSelections()).toEqual([backwards
      ? { anchor: { line: 2, ch: 3 }, head: { line: 1, ch: 0 } }
      : { anchor: { line: 1, ch: 0 }, head: { line: 2, ch: 3 } }]);
    applyCase(h.editor, 'lower');
    expect(h.getValue()).toBe('prefix\nss\nété\nsuffix');
  });
  it('isolates successive conversions from each other and adjacent typing', () => {
    let formatting = false;
    const h = new EditorHarness('ciao', [{ anchor: 4, head: 4 }], [isolateFormattingHistory(() => formatting)]);
    h.type(' mondo');
    h.state = h.state.update({ selection: EditorSelection.range(0, 10) }).state;
    formatting = true;
    applyCase(h.editor, 'upper');
    applyCase(h.editor, 'words');
    formatting = false;
    h.state = h.state.update({ selection: EditorSelection.cursor(10) }).state;
    h.type('!');
    h.undo(); expect(h.getValue()).toBe('Ciao Mondo');
    h.undo(); expect(h.getValue()).toBe('CIAO MONDO');
    h.undo(); expect(h.getValue()).toBe('ciao mondo');
    h.undo(); expect(h.getValue()).toBe('ciao');
    h.redo(); h.redo(); h.redo(); h.redo();
    expect(h.getValue()).toBe('Ciao Mondo!');
  });
});
