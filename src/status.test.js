const fs = require('fs');
const path = require('path');

let mod;
function getModule() {
  jest.resetModules();
  const tmp = require('os').tmpdir();
  process.env.HOME = tmp;
  mod = require('./status');
  return mod;
}

beforeEach(() => {
  getModule();
  mod.clearStatus();
});

test('setStatus stores a key/value with timestamp', () => {
  const entry = mod.setStatus('session', 'active');
  expect(entry.value).toBe('active');
  expect(entry.updatedAt).toBeDefined();
});

test('getStatus retrieves a stored key', () => {
  mod.setStatus('mode', 'dark');
  const entry = mod.getStatus('mode');
  expect(entry).not.toBeNull();
  expect(entry.value).toBe('dark');
});

test('getStatus returns null for missing key', () => {
  expect(mod.getStatus('nonexistent')).toBeNull();
});

test('removeStatus deletes an existing key', () => {
  mod.setStatus('foo', 'bar');
  const result = mod.removeStatus('foo');
  expect(result).toBe(true);
  expect(mod.getStatus('foo')).toBeNull();
});

test('removeStatus returns false for missing key', () => {
  expect(mod.removeStatus('ghost')).toBe(false);
});

test('listStatus returns all entries', () => {
  mod.setStatus('a', '1');
  mod.setStatus('b', '2');
  const data = mod.listStatus();
  expect(Object.keys(data)).toHaveLength(2);
  expect(data.a.value).toBe('1');
  expect(data.b.value).toBe('2');
});

test('clearStatus empties all entries', () => {
  mod.setStatus('x', 'y');
  mod.clearStatus();
  expect(Object.keys(mod.listStatus())).toHaveLength(0);
});
