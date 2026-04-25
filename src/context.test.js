const fs = require('fs');
const path = require('path');
const os = require('os');

let tmpDir;
let mod;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-ctx-'));
  process.env.HOME = tmpDir;
  jest.resetModules();
  mod = require('./context');
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('ensureContextsDir creates dir', () => {
  mod.ensureContextsDir();
  expect(fs.existsSync(path.join(tmpDir, '.tabforge', 'contexts'))).toBe(true);
});

test('saveContext and loadContext roundtrip', () => {
  mod.saveContext('work', { name: 'work', description: 'Work context' });
  const ctx = mod.loadContext('work');
  expect(ctx.name).toBe('work');
  expect(ctx.description).toBe('Work context');
});

test('loadContext returns null for missing', () => {
  expect(mod.loadContext('nope')).toBeNull();
});

test('listContexts returns saved names', () => {
  mod.saveContext('alpha', { name: 'alpha' });
  mod.saveContext('beta', { name: 'beta' });
  const list = mod.listContexts();
  expect(list).toContain('alpha');
  expect(list).toContain('beta');
});

test('deleteContext removes file', () => {
  mod.saveContext('tmp', { name: 'tmp' });
  expect(mod.deleteContext('tmp')).toBe(true);
  expect(mod.loadContext('tmp')).toBeNull();
});

test('deleteContext returns false for missing', () => {
  expect(mod.deleteContext('ghost')).toBe(false);
});

test('renameContext renames correctly', () => {
  mod.saveContext('old', { name: 'old', description: 'desc' });
  expect(mod.renameContext('old', 'new')).toBe(true);
  expect(mod.loadContext('new').name).toBe('new');
  expect(mod.loadContext('old')).toBeNull();
});

test('renameContext returns false for missing source', () => {
  expect(mod.renameContext('missing', 'other')).toBe(false);
});
