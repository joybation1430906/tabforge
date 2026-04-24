const fs = require('fs');
const path = require('path');
const os = require('os');

let mod;
function getModule() {
  jest.resetModules();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-layout-'));
  jest.mock('os', () => ({ homedir: () => tmpDir }));
  return require('./layout');
}

beforeEach(() => { mod = getModule(); });

test('ensureLayoutsDir creates directory', () => {
  const dir = mod.ensureLayoutsDir();
  expect(fs.existsSync(dir)).toBe(true);
});

test('saveLayout and loadLayout round-trip', () => {
  const layout = { name: 'work', cols: 3, rows: 2, created: '2024-01-01T00:00:00.000Z' };
  mod.saveLayout('work', layout);
  const loaded = mod.loadLayout('work');
  expect(loaded).toEqual(layout);
});

test('loadLayout returns null for missing layout', () => {
  expect(mod.loadLayout('ghost')).toBeNull();
});

test('listLayouts returns saved layout names', () => {
  mod.saveLayout('alpha', { name: 'alpha', cols: 2, rows: 1 });
  mod.saveLayout('beta', { name: 'beta', cols: 4, rows: 2 });
  const list = mod.listLayouts();
  expect(list).toContain('alpha');
  expect(list).toContain('beta');
});

test('deleteLayout removes file and returns true', () => {
  mod.saveLayout('temp', { name: 'temp', cols: 1, rows: 1 });
  expect(mod.deleteLayout('temp')).toBe(true);
  expect(mod.loadLayout('temp')).toBeNull();
});

test('deleteLayout returns false for missing layout', () => {
  expect(mod.deleteLayout('nope')).toBe(false);
});

test('renameLayout renames correctly', () => {
  mod.saveLayout('old', { name: 'old', cols: 2, rows: 1 });
  const ok = mod.renameLayout('old', 'new');
  expect(ok).toBe(true);
  expect(mod.loadLayout('old')).toBeNull();
  expect(mod.loadLayout('new')).not.toBeNull();
  expect(mod.loadLayout('new').name).toBe('new');
});

test('renameLayout returns false if source missing', () => {
  expect(mod.renameLayout('missing', 'other')).toBe(false);
});
