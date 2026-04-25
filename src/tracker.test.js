const fs = require('fs');
const path = require('path');
const os = require('os');

let mod;
function getModule() {
  jest.resetModules();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-tracker-'));
  jest.doMock('os', () => ({ ...os, homedir: () => tmpDir }));
  return require('./tracker');
}

beforeEach(() => { mod = getModule(); });

test('ensureTrackerFile creates file', () => {
  mod.ensureTrackerFile();
  const entries = mod.loadTracker();
  expect(Array.isArray(entries)).toBe(true);
});

test('trackUrl adds new entry', () => {
  const entry = mod.trackUrl('https://example.com');
  expect(entry.url).toBe('https://example.com');
  expect(entry.visits).toBe(1);
});

test('trackUrl increments visits on repeat', () => {
  mod.trackUrl('https://example.com');
  const entry = mod.trackUrl('https://example.com');
  expect(entry.visits).toBe(2);
});

test('trackUrl stores label in meta', () => {
  const entry = mod.trackUrl('https://example.com', { label: 'home' });
  expect(entry.label).toBe('home');
});

test('getTracked returns null for unknown url', () => {
  expect(mod.getTracked('https://nope.com')).toBeNull();
});

test('listTracked returns all entries', () => {
  mod.trackUrl('https://a.com');
  mod.trackUrl('https://b.com');
  expect(mod.listTracked().length).toBe(2);
});

test('removeTracked removes entry', () => {
  mod.trackUrl('https://a.com');
  const removed = mod.removeTracked('https://a.com');
  expect(removed).toBe(true);
  expect(mod.listTracked().length).toBe(0);
});

test('removeTracked returns false for missing url', () => {
  expect(mod.removeTracked('https://ghost.com')).toBe(false);
});

test('clearTracker empties all entries', () => {
  mod.trackUrl('https://a.com');
  mod.clearTracker();
  expect(mod.listTracked().length).toBe(0);
});

test('topTracked returns sorted by visits', () => {
  mod.trackUrl('https://a.com');
  mod.trackUrl('https://b.com');
  mod.trackUrl('https://b.com');
  mod.trackUrl('https://b.com');
  const top = mod.topTracked(2);
  expect(top[0].url).toBe('https://b.com');
  expect(top[0].visits).toBe(3);
});
