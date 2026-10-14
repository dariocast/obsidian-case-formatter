import type { Editor, EditorPosition } from 'obsidian';
import { formatText, type CaseMode } from './format';

export function hasSelection(editor: Editor): boolean {
  return editor.listSelections().some(({ anchor, head }) =>
    anchor.line !== head.line || anchor.ch !== head.ch);
}

function positionAt(text: string, offset: number): EditorPosition {
  const before = text.slice(0, offset);
  return { line: before.split('\n').length - 1, ch: offset - before.lastIndexOf('\n') - 1 };
}

/** Apply all selected ranges in one native transaction and retain their direction. */
export function applyCase(editor: Editor, mode: CaseMode): boolean {
  const original = editor.getValue();
  const ranges = editor.listSelections().map(selection => {
    const anchor = editor.posToOffset(selection.anchor);
    const head = editor.posToOffset(selection.head);
    const from = Math.min(anchor, head);
    const to = Math.max(anchor, head);
    const source = original.slice(from, to);
    return { from, to, backwards: anchor > head, source, text: formatText(source, mode) };
  }).sort((a, b) => a.from - b.from);

  if (!ranges.some(range => range.source !== range.text)) return false;

  let result = '';
  let cursor = 0;
  const selections: { from: EditorPosition; to: EditorPosition }[] = [];
  for (const range of ranges) {
    result += original.slice(cursor, range.from);
    const start = result.length;
    result += range.text;
    const from = positionAt(result, start);
    const to = positionAt(result, result.length);
    selections.push(range.backwards ? { from: to, to: from } : { from, to });
    cursor = range.to;
  }

  editor.transaction({
    changes: ranges.filter(range => range.source !== range.text).map(range => ({
      from: editor.offsetToPos(range.from),
      to: editor.offsetToPos(range.to),
      text: range.text,
    })),
    selections,
  });
  return true;
}
