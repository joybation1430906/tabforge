const fs = require('fs');
const path = require('path');
const os = require('os');

let triggerMod, cmdMod;
beforeEach(() => {
  jest.resetModules();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-trigcmd-'));
  jest.doMock('os', () => ({ ...os, homedir: () => tmp }));
  triggerMod = require('./trigger');
  cmdMod = require('./trigger-commands');
});

function captureLog(fn) {
  const logs = [];
  const orig = console.log;
  console.log = (...a) => logs.push(a.join(' '));
  fn();
  console.log = orig;
  return logs;
}

test('cmdTriggerAdd adds and prints trigger', () => {
  const logs = captureLog(() => cmdMod.cmdTriggerAdd(['my-trigger', 'launch', 'dev-session']));
  expect(logs[0]).toContain('my-trigger');
  expect(logs[0]).toContain('launch');
});

test('cmdTriggerList shows triggers', () => {
  triggerMod.addTrigger('list-t', 'open', 'sess');
  const logs = captureLog(() => cmdMod.cmdTriggerList());
  expect(logs.some(l => l.includes('list-t'))).toBe(true);
});

test('cmdTriggerList shows empty message', () => {
  const logs = captureLog(() => cmdMod.cmdTriggerList());
  expect(logs[0]).toMatch(/no triggers/i);
});

test('cmdTriggerShow prints trigger json', () => {
  triggerMod.addTrigger('show-t', 'save', 'target');
  const logs = captureLog(() => cmdMod.cmdTriggerShow(['show-t']));
  expect(logs.join('\n')).toContain('show-t');
});

test('cmdTriggerToggle toggles and prints status', () => {
  triggerMod.addTrigger('tog-t', 'close', 'x');
  const logs = captureLog(() => cmdMod.cmdTriggerToggle(['tog-t']));
  expect(logs[0]).toContain('disabled');
});

test('cmdTriggerRemove removes trigger', () => {
  triggerMod.addTrigger('rm-t', 'launch', 'y');
  const logs = captureLog(() => cmdMod.cmdTriggerRemove(['rm-t']));
  expect(logs[0]).toContain('removed');
  expect(triggerMod.loadTriggers().find(t => t.name === 'rm-t')).toBeUndefined();
});

test('handleTriggerCommand dispatches correctly', () => {
  const logs = captureLog(() => cmdMod.handleTriggerCommand('add', ['dispatch-t', 'launch', 'sess']));
  expect(logs[0]).toContain('dispatch-t');
});
