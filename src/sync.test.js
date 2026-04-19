const fs = require('fs');
const os = require('os');
const path = require('path');

const SYNC_FILE = path.join(os.homedir(), '.tabforge', 'sync', 'sync.json');

let mod;
function getModule() {
  jest.resetModules();
  mod = require('./sync');
  return mod;
}

beforeEach(() => {
  if (fs.existsSync(SYNC_FILE)) fs.writeFileSync(SYNC_FILE, JSON.stringify({ remotes: [] }, null, 2));
  getModule();
});

test('ensureSyncDir creates dir and file', () => {
  mod.ensureSyncDir();
  expect(fs.existsSync(SYNC_FILE)).toBe(true);
});

test('addRemote adds a remote', () => {
  const remotes = mod.addRemote('origin', 'https://example.com/tabs');
  expect(remotes).toHaveLength(1);
  expect(remotes[0].name).toBe('origin');
  expect(remotes[0].url).toBe('https://example.com/tabs');
});

test('addRemote throws on duplicate', () => {
  mod.addRemote('origin', 'https://example.com/tabs');
  expect(() => mod.addRemote('origin', 'https://other.com')).toThrow("Remote 'origin' already exists");
});

test('removeRemote removes a remote', () => {
  mod.addRemote('origin', 'https://example.com/tabs');
  const remotes = mod.removeRemote('origin');
  expect(remotes).toHaveLength(0);
});

test('removeRemote throws if not found', () => {
  expect(() => mod.removeRemote('ghost')).toThrow("Remote 'ghost' not found");
});

test('listRemotes returns all remotes', () => {
  mod.addRemote('a', 'https://a.com');
  mod.addRemote('b', 'https://b.com');
  expect(mod.listRemotes()).toHaveLength(2);
});

test('getRemote returns correct remote', () => {
  mod.addRemote('main', 'https://main.com');
  const r = mod.getRemote('main');
  expect(r.url).toBe('https://main.com');
});

test('getRemote throws if not found', () => {
  expect(() => mod.getRemote('nope')).toThrow("Remote 'nope' not found");
});
