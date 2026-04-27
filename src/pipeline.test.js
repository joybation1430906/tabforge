const fs = require('fs');
const path = require('path');
const os = require('os');

let tmpDir;
let mod;

function getModule() {
  jest.resetModules();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-pipeline-'));
  process.env.HOME = tmpDir;
  return require('./pipeline');
}

beforeEach(() => { mod = getModule(); });
afterEach(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

test('createPipeline returns object with name and steps', () => {
  const p = mod.createPipeline('deploy', ['build', 'test', 'release']);
  expect(p.name).toBe('deploy');
  expect(p.steps).toEqual(['build', 'test', 'release']);
  expect(p.createdAt).toBeDefined();
});

test('savePipeline and loadPipeline round-trip', () => {
  const p = mod.createPipeline('ci', ['lint', 'test']);
  mod.savePipeline('ci', p);
  const loaded = mod.loadPipeline('ci');
  expect(loaded.name).toBe('ci');
  expect(loaded.steps).toEqual(['lint', 'test']);
});

test('loadPipeline returns null for missing pipeline', () => {
  expect(mod.loadPipeline('nope')).toBeNull();
});

test('listPipelines returns saved pipeline names', () => {
  mod.savePipeline('alpha', mod.createPipeline('alpha', []));
  mod.savePipeline('beta', mod.createPipeline('beta', []));
  const list = mod.listPipelines();
  expect(list).toContain('alpha');
  expect(list).toContain('beta');
});

test('deletePipeline removes the file', () => {
  mod.savePipeline('temp', mod.createPipeline('temp', []));
  expect(mod.deletePipeline('temp')).toBe(true);
  expect(mod.loadPipeline('temp')).toBeNull();
});

test('deletePipeline returns false for missing pipeline', () => {
  expect(mod.deletePipeline('ghost')).toBe(false);
});

test('renamePipeline moves pipeline to new name', () => {
  mod.savePipeline('old', mod.createPipeline('old', ['step1']));
  const ok = mod.renamePipeline('old', 'new');
  expect(ok).toBe(true);
  expect(mod.loadPipeline('new').name).toBe('new');
  expect(mod.loadPipeline('old')).toBeNull();
});

test('renamePipeline returns false if source not found', () => {
  expect(mod.renamePipeline('missing', 'other')).toBe(false);
});
