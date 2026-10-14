import { EditorSelection, EditorState, Transaction, type Extension } from '@codemirror/state';
import { history, redo, undo } from '@codemirror/commands';
import type { Editor, EditorPosition, EditorTransaction } from 'obsidian';

// A real CodeMirror document/history behind the small portion of Obsidian's
// Editor API used by the plugin. No Obsidian application runtime is available in Vitest.
export class EditorHarness {
  state: EditorState;
  transactions = 0;
  constructor(doc: string, ranges: { anchor: number; head: number }[] = [{ anchor: 0, head: doc.length }], extensions: Extension[] = []) {
    this.state = EditorState.create({
      doc,
      selection: EditorSelection.create(ranges.map(r => EditorSelection.range(r.anchor, r.head))),
      extensions: [history(), EditorState.allowMultipleSelections.of(true), ...extensions],
    });
  }
  get editor(): Editor { return this as unknown as Editor; }
  getValue() { return this.state.doc.toString(); }
  posToOffset(pos: EditorPosition) { return this.state.doc.line(pos.line + 1).from + pos.ch; }
  offsetToPos(offset: number): EditorPosition {
    const line = this.state.doc.lineAt(offset);
    return { line: line.number - 1, ch: offset - line.from };
  }
  listSelections() {
    return this.state.selection.ranges.map(r => ({ anchor: this.offsetToPos(r.anchor), head: this.offsetToPos(r.head) }));
  }
  somethingSelected() { return this.state.selection.ranges.some(r => !r.empty); }
  transaction(tx: EditorTransaction) {
    this.transactions++;
    const changes = tx.changes?.map(c => ({ from: this.posToOffset(c.from), to: this.posToOffset(c.to ?? c.from), insert: c.text }));
    const changeSet = this.state.changes(changes ?? []);
    const nextDoc = changeSet.apply(this.state.doc);
    const offset = (p: EditorPosition) => nextDoc.line(p.line + 1).from + p.ch;
    this.state = this.state.update({
      changes: changeSet,
      selection: tx.selections ? EditorSelection.create(tx.selections.map(r => EditorSelection.range(offset(r.from), offset(r.to ?? r.from)))) : undefined,
    }).state;
  }
  type(text: string) {
    this.state = this.state.update(this.state.replaceSelection(text), { annotations: Transaction.userEvent.of('input.type') }).state;
  }
  undo() { return undo({ state: this.state, dispatch: tr => { this.state = tr.state; } }); }
  redo() { return redo({ state: this.state, dispatch: tr => { this.state = tr.state; } }); }
}
