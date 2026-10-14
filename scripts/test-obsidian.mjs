import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Explicitly target the disposable vault. Never run these edits in a personal vault.
const root = fileURLToPath(new URL('../', import.meta.url));
const expectedVault = path.join(root, 'test-vault');
const cli = (...args) => execFileSync('obsidian', ['vault=test-vault', ...args], { encoding: 'utf8' });
const evaluate = code => cli('eval', `code=${code}`);
evaluate(`window.caseFormatterTestResult = null; (async () => {
  if (app.vault.adapter.getBasePath() !== ${JSON.stringify(expectedVault)}) throw new Error('Wrong test vault');
  const view = app.workspace.activeEditor;
  if (!view?.editor || view.file?.path !== 'Acceptance.md') throw new Error('Open Acceptance.md in the test vault first');
  const checks = [];
  const assert = (condition, label) => { if (!condition) throw new Error(label); checks.push(label); };
  const actions = [['uppercase', 'THE LORD OF THE RINGS'], ['lowercase', 'the lord of the rings'], ['sentence-case', 'The lord of the rings'], ['capitalize-each-word', 'The Lord Of The Rings']];
  const editor = view.editor;
  const reset = text => { editor.setValue(text); editor.setSelection({line:0,ch:0}, editor.offsetToPos(text.length)); };

  for (const source of [false, true]) {
    await view.setState({...view.getState(), mode:'source', source}, {});
    for (const [id, expected] of actions) {
      reset('the LORD of the RINGS');
      app.commands.executeCommandById('case-formatter:' + id);
      assert(editor.getValue() === expected, (source ? 'Source mode' : 'Live Preview') + ': ' + id);
      assert(editor.getSelection() === expected, 'Selection retained: ' + source + '/' + id);
      editor.undo(); assert(editor.getValue() === 'the LORD of the RINGS', 'Native undo: ' + source + '/' + id);
      editor.redo(); assert(editor.getValue() === expected, 'Native redo: ' + source + '/' + id);
    }
  }

  reset('prefix\\nß\\nété\\nsuffix');
  editor.setSelections([{anchor:{line:1,ch:1},head:{line:1,ch:0}},{anchor:{line:2,ch:0},head:{line:2,ch:3}}]);
  app.commands.executeCommandById('case-formatter:uppercase');
  assert(editor.getValue() === 'prefix\\nSS\\nÉTÉ\\nsuffix', 'Multiple Unicode selections');
  assert(editor.listSelections()[0].anchor.ch === 2, 'Backwards selection after expansion');

  reset('ciao'); editor.setCursor({line:0,ch:4});
  editor.replaceSelection(' mondo', 'input.type');
  editor.setSelection({line:0,ch:0},{line:0,ch:10});
  app.commands.executeCommandById('case-formatter:uppercase');
  app.commands.executeCommandById('case-formatter:capitalize-each-word');
  editor.setCursor({line:0,ch:10}); editor.replaceSelection('!', 'input.type');
  for (const expected of ['Ciao Mondo','CIAO MONDO','ciao mondo','ciao']) {
    editor.undo(); assert(editor.getValue() === expected, 'Undo boundary: ' + expected);
  }

  const menuItems = [];
  const menu = {addSeparator(){return this;},addItem(callback) { const item = {setSection(section){this.section=section;return this;},setTitle(title){this.title=title;return this;},setIcon(){return this;},setDisabled(){return this;},setChecked(){return this;},onClick(callback){this.callback=callback;return this;}}; callback(item);if(item.section==='case-formatter')menuItems.push(item);return this;}};
  reset('hello world');
  app.workspace.trigger('editor-menu', menu, editor, view);
  assert(menuItems.length === 4, 'Host editor-menu event registers four items');
  menuItems[0].callback(); assert(editor.getValue() === 'HELLO WORLD', 'Context menu callback converts selection');
  menuItems.length=0; editor.setCursor({line:0,ch:0});
  app.workspace.trigger('editor-menu', menu, editor, view);
  assert(menuItems.length === 0, 'No menu actions without selection');

  await app.plugins.disablePluginAndSave('case-formatter');
  assert(!app.plugins.plugins['case-formatter'], 'Plugin unloaded');
  assert(!Object.keys(app.commands.commands).some(id => id.startsWith('case-formatter:')), 'Commands removed on unload');
  reset('hello world'); app.workspace.trigger('editor-menu', menu, editor, view);
  assert(menuItems.length === 0, 'Menu event removed on unload');
  await app.plugins.enablePluginAndSave('case-formatter');
  assert(!!app.plugins.plugins['case-formatter'], 'Plugin enabled again');

  reset('hello world'); editor.focus();
  return JSON.stringify({checks:checks.length,passed:checks});
})().then(result => {window.caseFormatterTestResult=result;}).catch(error => {window.caseFormatterTestResult=JSON.stringify({error:String(error),stack:error.stack});})`);
let output = '';
for (let attempt = 0; attempt < 30; attempt++) {
  output = evaluate('window.caseFormatterTestResult');
  if (output.includes('"checks":') || output.includes('"error":')) break;
  await new Promise(resolve => setTimeout(resolve, 100));
}
if (!output.includes('"checks":')) throw new Error(output);
console.log(output.trim());

// Exercise an assigned shortcut with a real Chromium keyboard event.
evaluate(`window.caseFormatterTestHotkeys = app.hotkeyManager.getHotkeys('case-formatter:uppercase'); app.hotkeyManager.setHotkeys('case-formatter:uppercase',[{modifiers:['Mod','Shift'],key:'U'}]); app.hotkeyManager.bake(); app.workspace.activeEditor.editor.focus()`);
try {
  const modifiers = process.platform === 'darwin' ? 12 : 10;
  for (const type of ['keyDown', 'keyUp']) {
    cli('dev:cdp', 'method=Input.dispatchKeyEvent', `params=${JSON.stringify({type, modifiers, key:'U',code:'KeyU',windowsVirtualKeyCode:85})}`);
  }
  const result = evaluate(`JSON.stringify({hotkeyPassed:app.workspace.activeEditor.editor.getValue() === 'HELLO WORLD'})`);
  if (!result.includes('"hotkeyPassed":true')) throw new Error(result);
  console.log('Assigned shortcut: passed');
} finally {
  evaluate(`app.hotkeyManager.setHotkeys('case-formatter:uppercase',window.caseFormatterTestHotkeys);app.hotkeyManager.bake();delete window.caseFormatterTestHotkeys`);
}

// Open and click the actual editor menu with trusted Chromium mouse events.
// Force a DOM menu only for this test, so its labels can be inspected.
const jsonResult = text => JSON.parse(text.replace(/^=>\s*/, '').trim());
const click = (point, button) => {
  for (const type of ['mousePressed', 'mouseReleased']) {
    cli('dev:cdp', 'method=Input.dispatchMouseEvent', `params=${JSON.stringify({type,x:point.x,y:point.y,button,clickCount:1})}`);
  }
};
try {
  const point = jsonResult(evaluate(`
    window.caseFormatterMenuRef=app.workspace.on('editor-menu',menu=>{menu.setUseNativeMenu(false);window.caseFormatterMenu=menu;});
    const editor=app.workspace.activeEditor.editor;editor.setValue('hello world');editor.setSelection({line:0,ch:0},{line:0,ch:11});editor.focus();
    const rect=editor.cm.coordsAtPos(2);JSON.stringify({x:rect.left+1,y:(rect.top+rect.bottom)/2})`));
  click(point, 'right');
  const menu = jsonResult(evaluate(`JSON.stringify({labels:[...document.querySelectorAll('.menu-item-title')].map(el=>el.textContent)})`));
  for (const label of ['UPPERCASE', 'lowercase', 'Sentence case', 'Capitalize Each Word']) {
    if (!menu.labels.includes(label)) throw new Error('Missing visible menu item: ' + label);
  }
  const target = jsonResult(evaluate(`
    const el=[...document.querySelectorAll('.menu-item')].find(el=>el.querySelector('.menu-item-title')?.textContent==='UPPERCASE');
    const rect=el.getBoundingClientRect();JSON.stringify({x:rect.left+rect.width/2,y:rect.top+rect.height/2})`));
  click(target, 'left');
  const result = evaluate(`JSON.stringify({menuClickPassed:app.workspace.activeEditor.editor.getValue()==='HELLO WORLD'})`);
  if (!result.includes('"menuClickPassed":true')) throw new Error(result);
  console.log('Visible context menu and mouse conversion: passed');
} finally {
  evaluate(`window.caseFormatterMenu?.hide();if(window.caseFormatterMenuRef)app.workspace.offref(window.caseFormatterMenuRef);delete window.caseFormatterMenu;delete window.caseFormatterMenuRef;delete window.caseFormatterTestResult`);
}
