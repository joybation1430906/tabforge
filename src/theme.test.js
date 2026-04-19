const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('fs');

const THEMES_DIR = path.join(os.homedir(), '.tabforge', 'themes');

let mod;
beforeEach(() => {
  jest.resetModules();
  fs.existsSync = jest.fn().mockReturnValue(true);
  fs.mkdirSync = jest.fn();
  fs.writeFileSync = jest.fn();
  fs.readFileSync = jest.fn();
  fs.readdirSync = jest.fn();
  fs.unlinkSync = jest.fn();
  mod = require('./theme');
});

test('saveTheme writes json file', () => {
  mod.saveTheme('dark', { name: 'dark', colors: ['#000'] });
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    path.join(THEMES_DIR, 'dark.json'),
    expect.stringContaining('dark')
  );
});

test('loadTheme returns parsed data', () => {
  fs.readFileSync.mockReturnValue(JSON.stringify({ name: 'dark', colors: [] }));
  const t = mod.loadTheme('dark');
  expect(t.name).toBe('dark');
});

test('loadTheme returns null if missing', () => {
  fs.existsSync.mockReturnValue(false);
  expect(mod.loadTheme('ghost')).toBeNull();
});

test('listThemes returns names without extension', () => {
  fs.readdirSync.mockReturnValue(['dark.json', 'light.json']);
  expect(mod.listThemes()).toEqual(['dark', 'light']);
});

test('deleteTheme removes file and returns true', () => {
  const result = mod.deleteTheme('dark');
  expect(fs.unlinkSync).toHaveBeenCalled();
  expect(result).toBe(true);
});

test('applyTheme merges theme into session', () => {
  const session = { name: 'work', tabs: [] };
  const theme = { name: 'dark', colors: ['#111'] };
  const result = mod.applyTheme(session, theme);
  expect(result.theme).toBe('dark');
  expect(result.colors).toEqual(['#111']);
});
