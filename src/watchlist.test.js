const fs = require('fs');
const path = require('path');
const os = require('os');

let mod;
function getModule() {
  jest.resetModules();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-watchlist-'));
  jest.doMock('os', () => ({ ...os, homedir: () => tmp }));
  return require('./watchlist');
}

beforeEach(() => { mod = getModule(); });

test('ensureWatchlistFile creates file', () => {
  mod.ensureWatchlistFile();
  const file = path.join(os.tmpdir(), '.tabforge', 'watchlist.json');
  // just check no error thrown
  expect(mod.loadWatchlist()).toEqual([]);
});

test('addToWatchlist adds entry', () => {
  const entry = mod.addToWatchlist('https://example.com', 'Example');
  expect(entry.url).toBe('https://example.com');
  expect(entry.label).toBe('Example');
  expect(entry.notified).toBe(false);
  expect(mod.getWatchlist()).toHaveLength(1);
});

test('addToWatchlist uses url as label if none given', () => {
  const entry = mod.addToWatchlist('https://foo.com');
  expect(entry.label).toBe('https://foo.com');
});

test('addToWatchlist throws on duplicate', () => {
  mod.addToWatchlist('https://dup.com');
  expect(() => mod.addToWatchlist('https://dup.com')).toThrow('already in watchlist');
});

test('removeFromWatchlist removes entry', () => {
  mod.addToWatchlist('https://remove.com');
  mod.removeFromWatchlist('https://remove.com');
  expect(mod.getWatchlist()).toHaveLength(0);
});

test('removeFromWatchlist throws if not found', () => {
  expect(() => mod.removeFromWatchlist('https://nope.com')).toThrow('not found');
});

test('markNotified sets notified flag', () => {
  mod.addToWatchlist('https://notify.com');
  mod.markNotified('https://notify.com');
  const list = mod.getWatchlist();
  expect(list[0].notified).toBe(true);
  expect(list[0].notifiedAt).toBeDefined();
});

test('clearWatchlist empties list', () => {
  mod.addToWatchlist('https://a.com');
  mod.addToWatchlist('https://b.com');
  mod.clearWatchlist();
  expect(mod.getWatchlist()).toHaveLength(0);
});
