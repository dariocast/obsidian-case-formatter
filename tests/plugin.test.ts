import { describe, expect, it } from 'vitest';
import type { Extension } from '@codemirror/state';
import CaseFormatter from '../src/main';
import { EditorHarness } from './editor-harness';
import { Menu, Plugin } from './obsidian-mock';

function loadPlugin() {
  // The Vitest alias supplies the host constructor for this integration test.
  const plugin = new (CaseFormatter as unknown as new () => CaseFormatter)();
  plugin.onload();
  return { plugin, host: plugin as unknown as Plugin };
}

describe('Obsidian integration', () => {
  it('registers exactly four commands without default hotkeys and managed hooks', () => {
    const { host } = loadPlugin();
    expect(host.commands.map(c => c.name)).toEqual(['UPPERCASE', 'lowercase', 'Sentence case', 'Capitalize Each Word']);
    expect(new Set(host.commands.map(c => c.id)).size).toBe(4);
    expect(host.commands.every(c => !c.hotkeys)).toBe(true);
    expect(host.events).toHaveLength(1);
    expect(host.extensions).toHaveLength(1);
    expect(host.app.workspace.on).toHaveBeenCalledWith('editor-menu', expect.any(Function));
  });
  it('checks availability without editing and executes each command', () => {
    const { host } = loadPlugin();
    const expected = ['CIAO MONDO', 'ciao mondo', 'Ciao mondo', 'Ciao Mondo'];
    host.commands.forEach((command, i) => {
      const h = new EditorHarness('cIAO mONDO');
      expect(command.editorCheckCallback(true, h.editor)).toBe(true);
      expect(h.transactions).toBe(0);
      expect(command.editorCheckCallback(false, h.editor)).toBe(true);
      expect(h.getValue()).toBe(expected[i]);
      const empty = new EditorHarness('ciao', [{ anchor: 1, head: 1 }]);
      expect(command.editorCheckCallback(false, empty.editor)).toBe(false);
      expect(empty.transactions).toBe(0);
    });
  });
  it('shows context items only on selection and uses the same conversions', () => {
    const { host } = loadPlugin();
    const listener = host.app.workspace.on.mock.calls[0]![1] as (menu: Menu, editor: unknown) => void;
    const emptyMenu = new Menu();
    listener(emptyMenu, new EditorHarness('', [{ anchor: 0, head: 0 }]).editor);
    expect(emptyMenu.items).toHaveLength(0);
    const expected = ['CIAO MONDO', 'ciao mondo', 'Ciao mondo', 'Ciao Mondo'];
    expected.forEach((text, i) => {
      const h = new EditorHarness('cIAO mONDO');
      const menu = new Menu();
      listener(menu, h.editor);
      expect(menu.items.map(item => item.title)).toEqual(host.commands.map(command => command.name));
      menu.items[i]!.callback!();
      expect(h.getValue()).toBe(text);
    });
  });
  it('isolates history through the real registered extension and resets the guard after errors', () => {
    const { host } = loadPlugin();
    const h = new EditorHarness('ciao', undefined, host.extensions as Extension[]);
    const command = host.commands[0]!;
    const originalTransaction = h.transaction;
    h.transaction = () => { throw new Error('host failure'); };
    expect(() => command.editorCheckCallback(false, h.editor)).toThrow('host failure');
    h.transaction = originalTransaction;
    command.editorCheckCallback(false, h.editor);
    host.commands[3]!.editorCheckCallback(false, h.editor);
    h.undo(); expect(h.getValue()).toBe('CIAO');
    h.undo(); expect(h.getValue()).toBe('ciao');
  });
});
