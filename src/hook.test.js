const fs = require('fs');
const path = require('path');
const os = require('os');

let tmpDir;
let mod;

function getModule() {
  jest.resetModules();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-hook-'));
  jest.doMock('os', () => ({ ...os, homedir: () => tmpDir }));
  return require('./hook');
}

beforeEach(() => { mod = getModule(); });
afterEach(() => { fs.rmSync(tmpDir, { recursive: true, force: true }); });

test('ensureHooksDir creates directory', () => {
  const dir = mod.ensureHooksDir();
  expect(fs.existsSync(dir)).toBe(true);
});

test('addHook saves and loadHook retrieves it', () => {
  mod.addHook('pre-launch', 'launch', 'echo launched');
  const hook = mod.loadHook('pre-launch');
  expect(hook).not.toBeNull();
  expect(hook.event).toBe('launch');
  expect(hook.command).toBe('echo launched');
  expect(hook.enabled).toBe(true);
});

test('loadHooks returns all hooks', () => {
  mod.addHook('h1', 'open', 'echo open');
  mod.addHook('h2', 'close', 'echo close');
  const hooks = mod.loadHooks();
  expect(hooks.length).toBe(2);
});

test('deleteHook removes the hook', () => {
  mod.addHook('to-delete', 'save', 'echo save');
  const result = mod.deleteHook('to-delete');
  expect(result).toBe(true);
  expect(mod.loadHook('to-delete')).toBeNull();
});

test('deleteHook returns false for missing hook', () => {
  expect(mod.deleteHook('nope')).toBe(false);
});

test('getHooksByEvent filters by event and enabled', () => {
  mod.addHook('active', 'launch', 'echo a');
  mod.addHook('inactive', 'launch', 'echo b', { enabled: false });
  mod.addHook('other', 'close', 'echo c');
  const hooks = mod.getHooksByEvent('launch');
  expect(hooks.length).toBe(1);
  expect(hooks[0].name).toBe('active');
});

test('loadHook returns null for unknown name', () => {
  expect(mod.loadHook('ghost')).toBeNull();
});
