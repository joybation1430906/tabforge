const fs = require('fs');
const os = require('os');
const path = require('path');

const TEST_DIR = path.join(os.tmpdir(), 'tabforge-preset-test-' + Date.now());

jest.mock('os', () => ({ homedir: () => TEST_DIR }));

const { savePreset, loadPreset, listPresets, deletePreset, renamePreset } = require('./preset');

afterAll(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }));

test('savePreset and loadPreset roundtrip', () => {
  const data = { name: 'work', urls: ['https://github.com', 'https://jira.io'], createdAt: '2024-01-01' };
  savePreset('work', data);
  const loaded = loadPreset('work');
  expect(loaded.name).toBe('work');
  expect(loaded.urls).toHaveLength(2);
});

test('loadPreset returns null for missing preset', () => {
  expect(loadPreset('nonexistent')).toBeNull();
});

test('listPresets returns saved presets', () => {
  savePreset('alpha', { name: 'alpha', urls: ['https://a.com'], createdAt: '2024-01-01' });
  const list = listPresets();
  expect(list).toContain('alpha');
});

test('deletePreset removes preset', () => {
  savePreset('temp', { name: 'temp', urls: [], createdAt: '2024-01-01' });
  expect(deletePreset('temp')).toBe(true);
  expect(loadPreset('temp')).toBeNull();
});

test('deletePreset returns false for missing preset', () => {
  expect(deletePreset('ghost')).toBe(false);
});

test('renamePreset moves data to new name', () => {
  savePreset('oldname', { name: 'oldname', urls: ['https://x.com'], createdAt: '2024-01-01' });
  expect(renamePreset('oldname', 'newname')).toBe(true);
  expect(loadPreset('newname').name).toBe('oldname');
  expect(loadPreset('oldname')).toBeNull();
});

test('renamePreset returns false for missing preset', () => {
  expect(renamePreset('nope', 'other')).toBe(false);
});
