const fs = require('fs');
const path = require('path');
const os = require('os');

jest.mock('fs');

const PLUGINS_DIR = path.join(os.homedir(), '.tabforge', 'plugins');

let mod;
function getModule() {
  jest.resetModules();
  return require('./plugin');
}

beforeEach(() => {
  jest.clearAllMocks();
  fs.existsSync.mockReturnValue(true);
  fs.readdirSync.mockReturnValue([]);
  mod = getModule();
});

test('savePlugin writes json file', () => {
  fs.writeFileSync.mockImplementation(() => {});
  mod.savePlugin('myplugin', { name: 'myplugin', entry: './foo.js', enabled: true });
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    path.join(PLUGINS_DIR, 'myplugin.json'),
    expect.stringContaining('myplugin')
  );
});

test('loadPlugin returns null if not found', () => {
  fs.existsSync.mockReturnValue(false);
  const result = mod.loadPlugin('missing');
  expect(result).toBeNull();
});

test('loadPlugin returns parsed data', () => {
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue(JSON.stringify({ name: 'myplugin', enabled: true }));
  const result = mod.loadPlugin('myplugin');
  expect(result.name).toBe('myplugin');
});

test('listPlugins returns names without extension', () => {
  fs.readdirSync.mockReturnValue(['a.json', 'b.json', 'notes.txt']);
  const result = mod.listPlugins();
  expect(result).toEqual(['a', 'b']);
});

test('deletePlugin returns false if not found', () => {
  fs.existsSync.mockReturnValue(false);
  expect(mod.deletePlugin('ghost')).toBe(false);
});

test('enablePlugin updates enabled flag', () => {
  const plugin = { name: 'p', enabled: false };
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue(JSON.stringify(plugin));
  fs.writeFileSync.mockImplementation(() => {});
  const result = mod.enablePlugin('p');
  expect(result).toBe(true);
  expect(JSON.parse(fs.writeFileSync.mock.calls[0][1]).enabled).toBe(true);
});
