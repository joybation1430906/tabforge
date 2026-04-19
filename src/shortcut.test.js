const fs = require('fs');
const path = require('path');
const os = require('os');

let tmpDir, mod;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-shortcut-'));
  jest.resetModules();
  process.env.HOME = tmpDir;
  mod = require('./shortcut');
});

afterEach(() => fs.rmSync(tmpDir, { recursive: true }));

test('loads empty shortcuts', () => {
  expect(mod.loadShortcuts()).toEqual({});
});

test('adds a shortcut', () => {
  mod.addShortcut('gh', 'https://github.com', 'GitHub');
  const s = mod.getShortcut('gh');
  expect(s.target).toBe('https://github.com');
  expect(s.description).toBe('GitHub');
});

test('throws on duplicate shortcut', () => {
  mod.addShortcut('gh', 'https://github.com');
  expect(() => mod.addShortcut('gh', 'https://github.com')).toThrow("Shortcut 'gh' already exists");
});

test('removes a shortcut', () => {
  mod.addShortcut('gh', 'https://github.com');
  mod.removeShortcut('gh');
  expect(mod.getShortcut('gh')).toBeNull();
});

test('throws when removing nonexistent shortcut', () => {
  expect(() => mod.removeShortcut('nope')).toThrow("Shortcut 'nope' not found");
});

test('lists all shortcuts', () => {
  mod.addShortcut('a', 'https://a.com');
  mod.addShortcut('b', 'https://b.com');
  const all = mod.listShortcuts();
  expect(Object.keys(all)).toHaveLength(2);
});
