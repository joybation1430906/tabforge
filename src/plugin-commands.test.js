jest.mock('./plugin');
const plugin = require('./plugin');
const { cmdPluginAdd, cmdPluginRemove, cmdPluginList, cmdPluginEnable, cmdPluginDisable } = require('./plugin-commands');

beforeEach(() => jest.clearAllMocks());

test('cmdPluginAdd saves plugin and logs', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdPluginAdd(['myplugin', './entry.js']);
  expect(plugin.savePlugin).toHaveBeenCalledWith('myplugin', expect.objectContaining({ name: 'myplugin', entry: './entry.js', enabled: true }));
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('added'));
  spy.mockRestore();
});

test('cmdPluginRemove logs not found', () => {
  plugin.deletePlugin.mockReturnValue(false);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdPluginRemove(['ghost']);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('not found'));
  spy.mockRestore();
});

test('cmdPluginList prints plugins', () => {
  plugin.listPlugins.mockReturnValue(['a']);
  plugin.loadPlugin.mockReturnValue({ enabled: true, entry: './a.js' });
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdPluginList();
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('a'));
  spy.mockRestore();
});

test('cmdPluginEnable calls enablePlugin', () => {
  plugin.enablePlugin.mockReturnValue(true);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdPluginEnable(['myplugin']);
  expect(plugin.enablePlugin).toHaveBeenCalledWith('myplugin');
  spy.mockRestore();
});

test('cmdPluginDisable calls disablePlugin', () => {
  plugin.disablePlugin.mockReturnValue(true);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdPluginDisable(['myplugin']);
  expect(plugin.disablePlugin).toHaveBeenCalledWith('myplugin');
  spy.mockRestore();
});
