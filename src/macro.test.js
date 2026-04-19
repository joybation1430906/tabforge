const fs = require('fs');
const os = require('os');
const path = require('path');

let saveMacro, loadMacro, listMacros, deleteMacro, runMacro;

beforeEach(() => {
  jest.resetModules();
  jest.spyOn(os, 'homedir').mockReturnValue('/tmp/tabforge-macro-test-' + Date.now());
  ({ saveMacro, loadMacro, listMacros, deleteMacro, runMacro } = require('./macro'));
});

test('saveMacro and loadMacro', () => {
  saveMacro('work', ['https://github.com', 'https://slack.com']);
  const m = loadMacro('work');
  expect(m.name).toBe('work');
  expect(m.steps).toEqual(['https://github.com', 'https://slack.com']);
  expect(m.createdAt).toBeDefined();
});

test('loadMacro returns null for missing', () => {
  expect(loadMacro('nope')).toBeNull();
});

test('listMacros returns saved macros', () => {
  saveMacro('a', ['https://a.com']);
  saveMacro('b', ['https://b.com']);
  const list = listMacros();
  expect(list).toContain('a');
  expect(list).toContain('b');
});

test('deleteMacro removes macro', () => {
  saveMacro('temp', ['https://x.com']);
  expect(deleteMacro('temp')).toBe(true);
  expect(loadMacro('temp')).toBeNull();
});

test('deleteMacro returns false if not found', () => {
  expect(deleteMacro('ghost')).toBe(false);
});

test('runMacro calls runner for each step', () => {
  saveMacro('multi', ['https://one.com', 'https://two.com']);
  const called = [];
  runMacro('multi', (url) => called.push(url));
  expect(called).toEqual(['https://one.com', 'https://two.com']);
});

test('runMacro throws for unknown macro', () => {
  expect(() => runMacro('missing', () => {})).toThrow("Macro 'missing' not found");
});
