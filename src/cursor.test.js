const fs = require('fs');
const path = require('path');
const os = require('os');

let mod;
const TEST_DIR = path.join(os.tmpdir(), 'tabforge-cursors-test-' + Date.now());

function getModule() {
  jest.resetModules();
  jest.doMock('os', () => ({ ...os, homedir: () => path.join(TEST_DIR, 'home') }));
  return require('./cursor');
}

beforeEach(() => {
  fs.mkdirSync(TEST_DIR, { recursive: true });
  mod = getModule();
});

afterEach(() => {
  fs.rmSync(TEST_DIR, { recursive: true, force: true });
  jest.resetModules();
});

test('ensureCursorsDir creates directory', () => {
  mod.ensureCursorsDir();
  expect(fs.existsSync(mod.CURSORS_DIR)).toBe(true);
});

test('saveCursor and loadCursor round-trip', () => {
  mod.saveCursor('myqueue', 3);
  const result = mod.loadCursor('myqueue');
  expect(result).not.toBeNull();
  expect(result.name).toBe('myqueue');
  expect(result.position).toBe(3);
  expect(result.updatedAt).toBeDefined();
});

test('loadCursor returns null for missing cursor', () => {
  const result = mod.loadCursor('nonexistent');
  expect(result).toBeNull();
});

test('deleteCursor removes file', () => {
  mod.saveCursor('todelete', 1);
  const removed = mod.deleteCursor('todelete');
  expect(removed).toBe(true);
  expect(mod.loadCursor('todelete')).toBeNull();
});

test('deleteCursor returns false if not found', () => {
  expect(mod.deleteCursor('ghost')).toBe(false);
});

test('listCursors returns all saved cursors', () => {
  mod.saveCursor('a', 0);
  mod.saveCursor('b', 5);
  const list = mod.listCursors();
  expect(list.length).toBe(2);
  const names = list.map(c => c.name).sort();
  expect(names).toEqual(['a', 'b']);
});

test('resetCursor sets position to 0', () => {
  mod.saveCursor('myqueue', 7);
  mod.resetCursor('myqueue');
  const result = mod.loadCursor('myqueue');
  expect(result.position).toBe(0);
});
