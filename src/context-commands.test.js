const fs = require('fs');
const path = require('path');
const os = require('os');

let tmpDir;
let cmds;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-ctx-cmd-'));
  process.env.HOME = tmpDir;
  jest.resetModules();
  cmds = require('./context-commands');
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

function capture(fn) {
  const logs = [];
  const orig = console.log;
  console.log = (...a) => logs.push(a.join(' '));
  fn();
  console.log = orig;
  return logs;
}

test('cmdContextSave prints saved message', () => {
  const out = capture(() => cmds.cmdContextSave(['myctx', 'my', 'description']));
  expect(out[0]).toMatch(/myctx/);
  expect(out[0]).toMatch(/saved/);
});

test('cmdContextSave requires name', () => {
  const out = capture(() => cmds.cmdContextSave([]));
  expect(out[0]).toMatch(/Usage/);
});

test('cmdContextList shows empty message', () => {
  const out = capture(() => cmds.cmdContextList());
  expect(out[0]).toMatch(/No contexts/);
});

test('cmdContextList shows saved contexts', () => {
  cmds.cmdContextSave(['ctx1']);
  const out = capture(() => cmds.cmdContextList());
  expect(out.some(l => l.includes('ctx1'))).toBe(true);
});

test('cmdContextShow prints context json', () => {
  cmds.cmdContextSave(['showme', 'desc']);
  const out = capture(() => cmds.cmdContextShow(['showme']));
  expect(out.join('\n')).toMatch(/showme/);
});

test('cmdContextDelete removes context', () => {
  cmds.cmdContextSave(['todel']);
  const out = capture(() => cmds.cmdContextDelete(['todel']));
  expect(out[0]).toMatch(/deleted/);
});

test('cmdContextRename renames context', () => {
  cmds.cmdContextSave(['orig']);
  const out = capture(() => cmds.cmdContextRename(['orig', 'renamed']));
  expect(out[0]).toMatch(/renamed/);
});

test('handleContextCommand dispatches correctly', () => {
  const out = capture(() => cmds.handleContextCommand('list', []));
  expect(out[0]).toMatch(/No contexts/);
});

test('handleContextCommand unknown sub', () => {
  const out = capture(() => cmds.handleContextCommand('fly', []));
  expect(out[0]).toMatch(/Unknown/);
});
