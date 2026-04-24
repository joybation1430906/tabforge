const fs = require('fs');
const path = require('path');
const os = require('os');

let mod;
function getModule() {
  jest.resetModules();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-trigger-'));
  jest.doMock('os', () => ({ ...os, homedir: () => tmp }));
  mod = require('./trigger');
  return mod;
}

beforeEach(() => { getModule(); });

test('ensureTriggersFile creates file', () => {
  mod.ensureTriggersFile();
  const triggers = mod.loadTriggers();
  expect(Array.isArray(triggers)).toBe(true);
});

test('addTrigger adds a trigger', () => {
  const t = mod.addTrigger('test-trigger', 'launch', 'work-session');
  expect(t.name).toBe('test-trigger');
  expect(t.event).toBe('launch');
  expect(t.target).toBe('work-session');
  expect(t.enabled).toBe(true);
});

test('addTrigger throws on duplicate name', () => {
  mod.addTrigger('dup', 'open', 'session-a');
  expect(() => mod.addTrigger('dup', 'close', 'session-b')).toThrow("Trigger 'dup' already exists");
});

test('removeTrigger removes a trigger', () => {
  mod.addTrigger('to-remove', 'save', 'session-x');
  mod.removeTrigger('to-remove');
  expect(mod.loadTriggers().find(t => t.name === 'to-remove')).toBeUndefined();
});

test('removeTrigger throws if not found', () => {
  expect(() => mod.removeTrigger('ghost')).toThrow("Trigger 'ghost' not found");
});

test('getTrigger returns correct trigger', () => {
  mod.addTrigger('get-me', 'launch', 'target-session');
  const t = mod.getTrigger('get-me');
  expect(t.name).toBe('get-me');
});

test('toggleTrigger flips enabled state', () => {
  mod.addTrigger('toggle-me', 'open', 'session-y');
  const t1 = mod.toggleTrigger('toggle-me');
  expect(t1.enabled).toBe(false);
  const t2 = mod.toggleTrigger('toggle-me');
  expect(t2.enabled).toBe(true);
});

test('getTriggersForEvent returns only enabled matching triggers', () => {
  mod.addTrigger('t1', 'launch', 'a');
  mod.addTrigger('t2', 'launch', 'b');
  mod.addTrigger('t3', 'close', 'c');
  mod.toggleTrigger('t2');
  const results = mod.getTriggersForEvent('launch');
  expect(results.length).toBe(1);
  expect(results[0].name).toBe('t1');
});
