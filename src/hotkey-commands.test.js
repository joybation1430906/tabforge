const { cmdHotkeyAdd, cmdHotkeyRemove, cmdHotkeyList, cmdHotkeyShow, handleHotkeyCommand } = require('./hotkey-commands');

jest.mock('./hotkey', () => ({
  addHotkey: jest.fn(),
  removeHotkey: jest.fn(),
  listHotkeys: jest.fn(),
  getHotkey: jest.fn()
}));

const hotkey = require('./hotkey');

beforeEach(() => jest.clearAllMocks());

test('cmdHotkeyAdd calls addHotkey and logs', () => {
  hotkey.addHotkey.mockReturnValue({ key: 'ctrl+1', target: 'work', type: 'session' });
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdHotkeyAdd(['ctrl+1', 'work']);
  expect(hotkey.addHotkey).toHaveBeenCalledWith('ctrl+1', 'work', 'session');
  spy.mockRestore();
});

test('cmdHotkeyAdd exits on missing args', () => {
  const spy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
  expect(() => cmdHotkeyAdd([])).toThrow('exit');
  spy.mockRestore();
});

test('cmdHotkeyRemove calls removeHotkey', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdHotkeyRemove(['ctrl+1']);
  expect(hotkey.removeHotkey).toHaveBeenCalledWith('ctrl+1');
  spy.mockRestore();
});

test('cmdHotkeyList prints hotkeys', () => {
  hotkey.listHotkeys.mockReturnValue([{ key: 'ctrl+1', target: 'work', type: 'session' }]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdHotkeyList();
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

test('cmdHotkeyList prints empty message', () => {
  hotkey.listHotkeys.mockReturnValue([]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdHotkeyList();
  expect(spy).toHaveBeenCalledWith('No hotkeys defined.');
  spy.mockRestore();
});

test('handleHotkeyCommand routes to show', () => {
  hotkey.getHotkey.mockReturnValue({ key: 'ctrl+1', target: 'work', type: 'session' });
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleHotkeyCommand('show', ['ctrl+1']);
  expect(hotkey.getHotkey).toHaveBeenCalledWith('ctrl+1');
  spy.mockRestore();
});
