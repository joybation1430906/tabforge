const fs = require('fs');
const os = require('os');
const path = require('path');

let tmpDir;
let mod;

function getModule() {
  jest.resetModules();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-hotkey-'));
  jest.mock('os', () => ({ homedir: () => tmpDir }));
  return require('./hotkey');
}

beforeEach(() => { mod = getModule(); });
aftereEach(() => { fs.rmSync(tmpDir, { recursive: true, force: true }); });

test('ensureHotkeysFile creates file', () => {
  mod.ensureHotkeysFile();
  const file = path.join(tmpDir, '.tabforge', 'hotkeys.json');
  expect(fs.existsSync(file)).toBe(true);
});

test('addHotkey stores a hotkey', () => {
  const h = mod.addHotkey('ctrl+1', 'work', 'session');
  expect(h.key).toBe('ctrl+1');
  expect(h.target).toBe('work');
  expect(h.type).toBe('session');
});

test('addHotkey throws on duplicate key', () => {
  mod.addHotkey('ctrl+1', 'work');
  expect(() => mod.addHotkey('ctrl+1', 'other')).toThrow("Hotkey 'ctrl+1' already exists");
});

test('removeHotkey removes existing hotkey', () => {
  mod.addHotkey('ctrl+2', 'dev');
  mod.removeHotkey('ctrl+2');
  expect(mod.getHotkey('ctrl+2')).toBeNull();
});

test('removeHotkey throws when not found', () => {
  expect(() => mod.removeHotkey('ctrl+9')).toThrow("Hotkey 'ctrl+9' not found");
});

test('listHotkeys returns all hotkeys', () => {
  mod.addHotkey('ctrl+1', 'a');
  mod.addHotkey('ctrl+2', 'b');
  expect(mod.listHotkeys()).toHaveLength(2);
});

test('getHotkey returns null for missing key', () => {
  expect(mod.getHotkey('ctrl+0')).toBeNull();
});
