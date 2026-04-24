const fs = require('fs');
const path = require('path');
const os = require('os');

let mod;
function getModule() {
  jest.resetModules();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-batch-'));
  jest.mock('os', () => ({ ...jest.requireActual('os'), homedir: () => tmpDir }));
  return require('./batch');
}

beforeEach(() => { mod = getModule(); });

test('ensureBatchDir creates directory', () => {
  mod.ensureBatchDir();
  expect(fs.existsSync(mod.getBatchPath('x').replace('/x.json', ''))).toBe(true);
});

test('createBatch saves and returns batch', () => {
  const batch = mod.createBatch('work', ['session1']);
  expect(batch.name).toBe('work');
  expect(batch.sessions).toEqual(['session1']);
  expect(batch.createdAt).toBeDefined();
});

test('loadBatch returns null for missing batch', () => {
  expect(mod.loadBatch('nope')).toBeNull();
});

test('loadBatch returns saved batch', () => {
  mod.createBatch('dev', []);
  const batch = mod.loadBatch('dev');
  expect(batch.name).toBe('dev');
});

test('listBatches returns all batch names', () => {
  mod.createBatch('a', []);
  mod.createBatch('b', []);
  const list = mod.listBatches();
  expect(list).toContain('a');
  expect(list).toContain('b');
});

test('addSessionToBatch appends session', () => {
  mod.createBatch('test', []);
  const batch = mod.addSessionToBatch('test', 'newsession');
  expect(batch.sessions).toContain('newsession');
});

test('addSessionToBatch returns null for missing batch', () => {
  expect(mod.addSessionToBatch('ghost', 's')).toBeNull();
});

test('removeSessionFromBatch removes by index', () => {
  mod.createBatch('rm', ['a', 'b', 'c']);
  const batch = mod.removeSessionFromBatch('rm', 1);
  expect(batch.sessions).toEqual(['a', 'c']);
});

test('removeSessionFromBatch returns null for bad index', () => {
  mod.createBatch('bad', ['x']);
  expect(mod.removeSessionFromBatch('bad', 5)).toBeNull();
});

test('deleteBatch removes file', () => {
  mod.createBatch('todel', []);
  expect(mod.deleteBatch('todel')).toBe(true);
  expect(mod.loadBatch('todel')).toBeNull();
});

test('deleteBatch returns false for missing batch', () => {
  expect(mod.deleteBatch('missing')).toBe(false);
});
