const fs = require('fs');
const path = require('path');
const os = require('os');

let mod;
function getModule() {
  jest.resetModules();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-milestone-'));
  jest.doMock('os', () => ({ ...os, homedir: () => tmpDir }));
  return require('./milestone');
}

beforeEach(() => { mod = getModule(); });

test('ensureMilestonesDir creates directory', () => {
  mod.ensureMilestonesDir();
  expect(fs.existsSync(mod.getMilestonePath('x').replace('/x.json', ''))).toBe(true);
});

test('saveMilestone and loadMilestone round-trip', () => {
  const m = mod.saveMilestone('v1', { description: 'First release' });
  expect(m.name).toBe('v1');
  expect(m.description).toBe('First release');
  expect(m.createdAt).toBeDefined();
  const loaded = mod.loadMilestone('v1');
  expect(loaded).toEqual(m);
});

test('loadMilestone returns null for missing', () => {
  expect(mod.loadMilestone('nope')).toBeNull();
});

test('listMilestones returns saved names', () => {
  mod.saveMilestone('alpha', {});
  mod.saveMilestone('beta', {});
  const list = mod.listMilestones();
  expect(list).toContain('alpha');
  expect(list).toContain('beta');
});

test('deleteMilestone removes file', () => {
  mod.saveMilestone('temp', {});
  expect(mod.deleteMilestone('temp')).toBe(true);
  expect(mod.loadMilestone('temp')).toBeNull();
});

test('deleteMilestone returns false for missing', () => {
  expect(mod.deleteMilestone('ghost')).toBe(false);
});

test('renameMilestone moves milestone', () => {
  mod.saveMilestone('old', { description: 'desc' });
  expect(mod.renameMilestone('old', 'new')).toBe(true);
  expect(mod.loadMilestone('old')).toBeNull();
  const n = mod.loadMilestone('new');
  expect(n.name).toBe('new');
  expect(n.description).toBe('desc');
});

test('renameMilestone returns false for missing source', () => {
  expect(mod.renameMilestone('nobody', 'something')).toBe(false);
});
