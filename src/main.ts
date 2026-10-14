import { Plugin, type Editor } from 'obsidian';
import { applyCase, hasSelection } from './editor';
import type { CaseMode } from './format';
import { isolateFormattingHistory } from './history';

const actions: { id: string; name: string; mode: CaseMode; icon: string }[] = [
  { id: 'uppercase', name: 'UPPERCASE', mode: 'upper', icon: 'case-upper' },
  { id: 'lowercase', name: 'lowercase', mode: 'lower', icon: 'case-lower' },
  { id: 'sentence-case', name: 'Sentence case', mode: 'sentence', icon: 'case-sensitive' },
  { id: 'capitalize-each-word', name: 'Capitalize Each Word', mode: 'words', icon: 'whole-word' },
];

export default class CaseFormatter extends Plugin {
  private formatting = false;

  onload(): void {
    this.registerEditorExtension(isolateFormattingHistory(() => this.formatting));

    for (const action of actions) {
      this.addCommand({
        id: action.id,
        name: action.name,
        editorCheckCallback: (checking, editor) => {
          if (!hasSelection(editor)) return false;
          if (!checking) this.convert(editor, action.mode);
          return true;
        },
      });
    }

    this.registerEvent(this.app.workspace.on('editor-menu', (menu, editor) => {
      if (!hasSelection(editor)) return;
      for (const action of actions) {
        menu.addItem(item => item
          .setSection('case-formatter')
          .setTitle(action.name)
          .setIcon(action.icon)
          .onClick(() => this.convert(editor, action.mode)));
      }
    }));
  }

  private convert(editor: Editor, mode: CaseMode): void {
    this.formatting = true;
    try {
      applyCase(editor, mode);
    } finally {
      this.formatting = false;
    }
  }
}
