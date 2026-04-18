const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('os', () => ({ homedir: () => '/tmp/tabforge-alias-test-' + process.pid }));

const { addAlias, removeAlias, resolveAlias, listAliases, loadAliases } = require('./alias');

const testDir = path.join('/tmp/tabforge-alias-test-' + process.pid, '.tabforge');

afterEach(() => {
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true });
  }
});

test('addAlias creates an alias', () => {
  addAlias('work', 'work-session');
  const aliases = loadAliases();
  expect(aliases['work']).toBeDefined();
  expect(aliases['work'].target).toBe('work-session');
});

test('addAlias throws without name or target', () => {
  expect(() => addAlias('', 'target')).toThrow();
  expect(() => addAlias('name', '')).toThrow();
});

test('resolveAlias returns target', () => {
  addAlias('dev', 'dev-tabs');
  expect(resolveAlias('dev')).toBe('dev-tabs');
});

test('resolveAlias returns null for unknown', () => {
  expect(resolveAlias('nonexistent')).toBeNull();
});

test('removeAlias deletes alias', () => {
  addAlias('tmp', 'tmp-session');
  removeAlias('tmp');
  expect(resolveAlias('tmp')).toBeNull();
});

test('removeAlias throws if not found', () => {
  expect(() => removeAlias('ghost')).toThrow("Alias 'ghost' not found");
});

test('listAliases returns all aliases', () => {
  addAlias('a', 'session-a');
  addAlias('b', 'session-b');
  const list = listAliases();
  expect(Object.keys(list).length).toBe(2);
});
