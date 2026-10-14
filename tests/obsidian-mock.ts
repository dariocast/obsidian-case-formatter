import { vi } from 'vitest';

export class Plugin {
  commands: Record<string, any>[] = [];
  events: unknown[] = [];
  extensions: unknown[] = [];
  app = { workspace: { on: vi.fn((name: string, callback: unknown) => ({ name, callback })) } };
  addCommand(command: Record<string, any>) { this.commands.push(command); }
  registerEvent(event: unknown) { this.events.push(event); }
  registerEditorExtension(extension: unknown) { this.extensions.push(extension); }
}

export class MenuItem {
  title = '';
  section = '';
  callback?: () => void;
  setTitle(value: string) { this.title = value; return this; }
  setIcon(_value: string) { return this; }
  setSection(value: string) { this.section = value; return this; }
  onClick(callback: () => void) { this.callback = callback; return this; }
}

export class Menu {
  items: MenuItem[] = [];
  addItem(callback: (item: MenuItem) => void) {
    const item = new MenuItem();
    callback(item);
    this.items.push(item);
    return this;
  }
}
