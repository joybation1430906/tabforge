const fs = require('fs');
const path = require('path');
const os = require('os');

let mod;
function getModule() {
  jest.resetModules();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-replay-'));
  jest.mock('os', () => ({ homedir: () => tmpDir }));
  return require('./replay');
}

beforeEach(() => { mod = getModule(); });

test('ensureReplayDir creates directory', () => {
  mod.ensureReplayDir();
  const dir = path.join(require('os').homedir(), '.tabforge', 'replays');
  expect(fs.existsSync(dir)).toBe(true);
});

test('saveReplay and loadReplay round-trip', () => {
  const data = { name: 'test', steps: [{ step: 1, url: 'https://example.com' }], createdAt: '2024-01-01', stepCount: 1 };
  mod.saveReplay('test', data);
  const loaded = mod.loadReplay('test');
  expect(loaded).toEqual(data);
});

test('loadReplay returns null for missing replay', () => {
  expect(mod.loadReplay('nonexistent')).toBeNull();
});

test('listReplays returns saved replay names', () => {
  mod.saveReplay('alpha', { name: 'alpha', steps: [], createdAt: '', stepCount: 0 });
  mod.saveReplay('beta', { name: 'beta', steps: [], createdAt: '', stepCount: 0 });
  const list = mod.listReplays();
  expect(list).toContain('alpha');
  expect(list).toContain('beta');
});

test('deleteReplay removes file and returns true', () => {
  mod.saveReplay('todel', { name: 'todel', steps: [], createdAt: '', stepCount: 0 });
  expect(mod.deleteReplay('todel')).toBe(true);
  expect(mod.loadReplay('todel')).toBeNull();
});

test('deleteReplay returns false for missing replay', () => {
  expect(mod.deleteReplay('ghost')).toBe(false);
});

test('recordReplay stores steps with metadata', () => {
  const steps = [{ step: 1, url: 'https://a.com' }, { step: 2, url: 'https://b.com' }];
  const replay = mod.recordReplay('myrec', steps);
  expect(replay.name).toBe('myrec');
  expect(replay.stepCount).toBe(2);
  expect(mod.loadReplay('myrec')).not.toBeNull();
});

test('renameReplay moves data to new name', () => {
  mod.saveReplay('old', { name: 'old', steps: [], createdAt: '', stepCount: 0 });
  expect(mod.renameReplay('old', 'new')).toBe(true);
  expect(mod.loadReplay('new')).not.toBeNull();
  expect(mod.loadReplay('old')).toBeNull();
});

test('renameReplay returns false for missing replay', () => {
  expect(mod.renameReplay('missing', 'other')).toBe(false);
});
