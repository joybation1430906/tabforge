const fs = require('fs');
const path = require('path');

let mod;
function getModule() {
  jest.resetModules();
  jest.mock('os', () => ({ homedir: () => '/tmp/tabforge-test-flow' }));
  return require('./flow');
}

beforeEach(() => {
  mod = getModule();
});

afterEach(() => {
  fs.rmSync('/tmp/tabforge-test-flow', { recursive: true, force: true });
});

test('ensureFlowsDir creates directory', () => {
  mod.ensureFlowsDir();
  expect(fs.existsSync('/tmp/tabforge-test-flow/.tabforge/flows')).toBe(true);
});

test('saveFlow and loadFlow round-trip', () => {
  const flow = { name: 'work', steps: ['https://github.com', 'https://slack.com'], createdAt: '2024-01-01' };
  mod.saveFlow('work', flow);
  const loaded = mod.loadFlow('work');
  expect(loaded.name).toBe('work');
  expect(loaded.steps).toHaveLength(2);
});

test('loadFlow returns null for missing flow', () => {
  expect(mod.loadFlow('nope')).toBeNull();
});

test('listFlows returns saved flows', () => {
  mod.saveFlow('a', { steps: [] });
  mod.saveFlow('b', { steps: [] });
  const list = mod.listFlows();
  expect(list).toContain('a');
  expect(list).toContain('b');
});

test('deleteFlow removes flow', () => {
  mod.saveFlow('temp', { steps: [] });
  expect(mod.deleteFlow('temp')).toBe(true);
  expect(mod.loadFlow('temp')).toBeNull();
});

test('deleteFlow returns false for missing', () => {
  expect(mod.deleteFlow('ghost')).toBe(false);
});

test('renameFlow renames correctly', () => {
  mod.saveFlow('old', { name: 'old', steps: ['https://a.com'] });
  expect(mod.renameFlow('old', 'new')).toBe(true);
  expect(mod.loadFlow('new')).not.toBeNull();
  expect(mod.loadFlow('old')).toBeNull();
});
