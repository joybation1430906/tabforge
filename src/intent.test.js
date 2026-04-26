const fs = require('fs');
const path = require('path');
const os = require('os');

let mod;
function getModule() {
  jest.resetModules();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-intent-'));
  jest.mock('os', () => ({ ...jest.requireActual('os'), homedir: () => tmpDir }));
  return require('./intent');
}

beforeEach(() => { mod = getModule(); });

test('ensureIntentsDir creates directory', () => {
  mod.ensureIntentsDir();
  expect(fs.existsSync(path.join(require('os').homedir(), '.tabforge', 'intents'))).toBe(true);
});

test('saveIntent and loadIntent round-trip', () => {
  const intent = { name: 'work', url: 'https://example.com', description: 'work stuff', createdAt: '2024-01-01' };
  mod.saveIntent('work', intent);
  const loaded = mod.loadIntent('work');
  expect(loaded).toEqual(intent);
});

test('loadIntent returns null for missing intent', () => {
  expect(mod.loadIntent('nope')).toBeNull();
});

test('listIntents returns saved intent names', () => {
  mod.saveIntent('a', { name: 'a', url: 'https://a.com' });
  mod.saveIntent('b', { name: 'b', url: 'https://b.com' });
  const list = mod.listIntents();
  expect(list).toContain('a');
  expect(list).toContain('b');
});

test('deleteIntent removes the file', () => {
  mod.saveIntent('del', { name: 'del', url: 'https://del.com' });
  expect(mod.deleteIntent('del')).toBe(true);
  expect(mod.loadIntent('del')).toBeNull();
});

test('deleteIntent returns false for missing intent', () => {
  expect(mod.deleteIntent('ghost')).toBe(false);
});

test('renameIntent renames correctly', () => {
  mod.saveIntent('old', { name: 'old', url: 'https://old.com' });
  expect(mod.renameIntent('old', 'new')).toBe(true);
  expect(mod.loadIntent('new')).not.toBeNull();
  expect(mod.loadIntent('old')).toBeNull();
});

test('renameIntent returns false for missing intent', () => {
  expect(mod.renameIntent('missing', 'other')).toBe(false);
});
