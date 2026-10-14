import { EditorState, type Extension } from '@codemirror/state';
import { isolateHistory } from '@codemirror/commands';

/** Add undo boundaries only during the synchronous formatting transaction. */
export function isolateFormattingHistory(isFormatting: () => boolean): Extension {
  return EditorState.transactionExtender.of(transaction =>
    isFormatting() && transaction.docChanged
      ? { annotations: isolateHistory.of('full') }
      : null);
}
