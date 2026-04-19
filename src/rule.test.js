const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('os', () => ({ homedir: () => '/tmp/tabforge-rule-test-' + process.pid }));

const { addRule, removeRule, getRule, toggleRule, applyRules, loadRules } = require('./rule');

const TEST_HOME = '/tmp/tabforge-rule-test-' + process.pid;

afterEach(() => {
  const file = path.join(TEST_HOME, '.tabforge', 'rules.json');
  if (fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify([]));
});

test('addRule adds a rule', () => {
  const rule = addRule('block-ads', 'ads.', { skip: true });
  expect(rule.name).toBe('block-ads');
  expect(rule.enabled).toBe(true);
  const rules = loadRules();
  expect(rules).toHaveLength(1);
});

test('addRule throws on duplicate', () => {
  addRule('dup', 'x', {});
  expect(() => addRule('dup', 'x', {})).toThrow("Rule 'dup' already exists");
});

test('getRule returns rule', () => {
  addRule('myrule', 'github.com', { group: 'dev' });
  const rule = getRule('myrule');
  expect(rule.condition).toBe('github.com');
});

test('getRule throws if not found', () => {
  expect(() => getRule('nope')).toThrow("Rule 'nope' not found");
});

test('removeRule removes a rule', () => {
  addRule('rm-me', 'foo', {});
  removeRule('rm-me');
  expect(loadRules()).toHaveLength(0);
});

test('toggleRule toggles enabled', () => {
  addRule('tog', 'bar', {});
  const toggled = toggleRule('tog');
  expect(toggled.enabled).toBe(false);
  const toggled2 = toggleRule('tog');
  expect(toggled2.enabled).toBe(true);
});

test('applyRules applies matching rules to tabs', () => {
  addRule('dev-group', 'github.com', { group: 'dev' });
  const tabs = [{ url: 'https://github.com/foo' }, { url: 'https://example.com' }];
  const result = applyRules(tabs);
  expect(result[0].group).toBe('dev');
  expect(result[1].group).toBeUndefined();
});
