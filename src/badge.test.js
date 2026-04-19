const fs = require('fs');
const os = require('os');
const path = require('path');

let mod;
const TMP = path.join(os.tmpdir(), `tabforge-badge-test-${Date.now()}`);
const BADGES_FILE = path.join(TMP, 'badges.json');

beforeEach(() => {
  jest.resetModules();
  jest.mock('os', () => ({ homedir: () => TMP }));
  if (!fs.existsSync(TMP)) fs.mkdirSync(TMP, { recursive: true });
  if (fs.existsSync(BADGES_FILE)) fs.unlinkSync(BADGES_FILE);
  mod = require('./badge');
});

afterAll(() => {
  fs.rmSync(TMP, { recursive: true, force: true });
});

test('loadBadges returns empty array initially', () => {
  expect(mod.loadBadges()).toEqual([]);
});

test('addBadge adds a badge', () => {
  const b = mod.addBadge('ci', 'https://ci.example.com', 'CI');
  expect(b.name).toBe('ci');
  expect(b.url).toBe('https://ci.example.com');
  expect(b.label).toBe('CI');
  expect(mod.loadBadges()).toHaveLength(1);
});

test('addBadge throws on duplicate', () => {
  mod.addBadge('ci', 'https://ci.example.com');
  expect(() => mod.addBadge('ci', 'https://other.com')).toThrow("Badge 'ci' already exists");
});

test('getBadge returns badge', () => {
  mod.addBadge('build', 'https://build.example.com', 'Build');
  const b = mod.getBadge('build');
  expect(b.name).toBe('build');
});

test('getBadge throws if not found', () => {
  expect(() => mod.getBadge('nope')).toThrow("Badge 'nope' not found");
});

test('removeBadge removes badge', () => {
  mod.addBadge('ci', 'https://ci.example.com');
  mod.removeBadge('ci');
  expect(mod.loadBadges()).toHaveLength(0);
});

test('removeBadge throws if not found', () => {
  expect(() => mod.removeBadge('ghost')).toThrow("Badge 'ghost' not found");
});

test('listBadges returns all badges', () => {
  mod.addBadge('a', 'https://a.com');
  mod.addBadge('b', 'https://b.com');
  expect(mod.listBadges()).toHaveLength(2);
});
