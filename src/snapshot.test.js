const fs = require('fs');
const path = require('path');
const os = require('os');

let mod;
function getModule() {
  jest.resetModules();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-snapshot-'));
  jest.mock('os', () => ({ ...jest.requireActual('os'), homedir: () => tmpDir }));
  return require('./snapshot');
}

beforeEach(() => { mod = getModule(); });

test('saveSnapshot creates a snapshot with tabs', () => {
  const snap = mod.saveSnapshot('work', { tabs: [{ url: 'https://github.com' }, { url: 'https://example.com' }] });
  expect(snap.name).toBe('work');
  expect(snap.tabs).toHaveLength(2);
  expect(snap.createdAt).toBeDefined();
});

test('loadSnapshot returns null for missing snapshot', () => {
  const result = mod.loadSnapshot('nonexistent');
  expect(result).toBeNull();
});

test('loadSnapshot returns saved snapshot', () => {
  mod.saveSnapshot('dev', { tabs: [{ url: 'https://localhost:3000' }] });
  const snap = mod.loadSnapshot('dev');
  expect(snap).not.toBeNull();
  expect(snap.name).toBe('dev');
  expect(snap.tabs[0].url).toBe('https://localhost:3000');
});

test('listSnapshots returns all saved snapshots', () => {
  mod.saveSnapshot('a', { tabs: [] });
  mod.saveSnapshot('b', { tabs: [{ url: 'https://x.com' }] });
  const list = mod.listSnapshots();
  expect(list).toHaveLength(2);
  expect(list.map(s => s.name)).toEqual(expect.arrayContaining(['a', 'b']));
});

test('deleteSnapshot removes the snapshot', () => {
  mod.saveSnapshot('temp', { tabs: [] });
  const ok = mod.deleteSnapshot('temp');
  expect(ok).toBe(true);
  expect(mod.loadSnapshot('temp')).toBeNull();
});

test('deleteSnapshot returns false for missing snapshot', () => {
  expect(mod.deleteSnapshot('ghost')).toBe(false);
});

test('renameSnapshot renames correctly', () => {
  mod.saveSnapshot('old', { tabs: [{ url: 'https://test.com' }] });
  const ok = mod.renameSnapshot('old', 'new');
  expect(ok).toBe(true);
  expect(mod.loadSnapshot('new').name).toBe('new');
  expect(mod.loadSnapshot('old')).toBeNull();
});

test('renameSnapshot returns false for missing snapshot', () => {
  expect(mod.renameSnapshot('nope', 'also-nope')).toBe(false);
});
