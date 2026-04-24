jest.mock('./layout');
const layout = require('./layout');
const { cmdLayoutSave, cmdLayoutList, cmdLayoutShow, cmdLayoutDelete, cmdLayoutRename } = require('./layout-commands');

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

test('cmdLayoutSave saves with defaults', () => {
  layout.saveLayout.mockReturnValue({});
  cmdLayoutSave(['mygrid']);
  expect(layout.saveLayout).toHaveBeenCalledWith('mygrid', expect.objectContaining({ cols: 2, rows: 1 }));
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('mygrid'));
});

test('cmdLayoutSave errors without name', () => {
  cmdLayoutSave([]);
  expect(console.error).toHaveBeenCalled();
  expect(layout.saveLayout).not.toHaveBeenCalled();
});

test('cmdLayoutList prints layouts', () => {
  layout.listLayouts.mockReturnValue(['foo']);
  layout.loadLayout.mockReturnValue({ cols: 2, rows: 1 });
  cmdLayoutList();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('foo'));
});

test('cmdLayoutList shows empty message', () => {
  layout.listLayouts.mockReturnValue([]);
  cmdLayoutList();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No layouts'));
});

test('cmdLayoutShow prints layout JSON', () => {
  layout.loadLayout.mockReturnValue({ name: 'bar', cols: 3, rows: 2 });
  cmdLayoutShow(['bar']);
  expect(console.log).toHaveBeenCalled();
});

test('cmdLayoutShow errors if not found', () => {
  layout.loadLayout.mockReturnValue(null);
  cmdLayoutShow(['missing']);
  expect(console.error).toHaveBeenCalledWith(expect.stringContaining('not found'));
});

test('cmdLayoutDelete deletes layout', () => {
  layout.deleteLayout.mockReturnValue(true);
  cmdLayoutDelete(['bye']);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('deleted'));
});

test('cmdLayoutRename renames layout', () => {
  layout.renameLayout.mockReturnValue(true);
  cmdLayoutRename(['old', 'new']);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Renamed'));
});
