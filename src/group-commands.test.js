const { cmdGroupSave, cmdGroupList, cmdGroupShow, cmdGroupDelete } = require('./group-commands');
const group = require('./group');

jest.mock('./group');

beforeEach(() => jest.clearAllMocks());

test('cmdGroupSave saves a group', () => {
  cmdGroupSave('work', ['https://github.com', 'https://jira.com']);
  expect(group.saveGroup).toHaveBeenCalledWith('work', expect.objectContaining({
    name: 'work',
    urls: ['https://github.com', 'https://jira.com']
  }));
});

test('cmdGroupSave throws if no name', () => {
  expect(() => cmdGroupSave('', ['https://example.com'])).toThrow('Group name is required');
});

test('cmdGroupSave throws if no urls', () => {
  expect(() => cmdGroupSave('work', [])).toThrow('At least one URL is required');
});

test('cmdGroupList prints groups', () => {
  group.listGroups.mockReturnValue(['work', 'personal']);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdGroupList();
  expect(spy).toHaveBeenCalledWith('  work');
  expect(spy).toHaveBeenCalledWith('  personal');
  spy.mockRestore();
});

test('cmdGroupList prints empty message', () => {
  group.listGroups.mockReturnValue([]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdGroupList();
  expect(spy).toHaveBeenCalledWith('No groups saved.');
  spy.mockRestore();
});

test('cmdGroupShow prints yaml', () => {
  group.loadGroup.mockReturnValue({ name: 'work', urls: [] });
  group.groupToYaml.mockReturnValue('name: work');
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdGroupShow('work');
  expect(spy).toHaveBeenCalledWith('name: work');
  spy.mockRestore();
});

test('cmdGroupDelete deletes a group', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdGroupDelete('work');
  expect(group.deleteGroup).toHaveBeenCalledWith('work');
  spy.mockRestore();
});

test('cmdGroupDelete throws if no name', () => {
  expect(() => cmdGroupDelete('')).toThrow('Group name is required');
});
