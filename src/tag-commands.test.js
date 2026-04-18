const { cmdTagAdd, cmdTagRemove, cmdTagList, cmdTagSearch, cmdTagRename } = require('./tag-commands');
const tag = require('./tag');

jest.mock('./tag');

beforeEach(() => jest.clearAllMocks());

test('cmdTagAdd tags a session', async () => {
  tag.addTag.mockResolvedValue();
  const spy = jest.spyOn(console, 'log').mockImplementation();
  await cmdTagAdd(['work', 'dev']);
  expect(tag.addTag).toHaveBeenCalledWith('work', 'dev');
  expect(spy).toHaveBeenCalledWith('Tagged "work" with "dev"');
  spy.mockRestore();
});

test('cmdTagAdd exits if args missing', async () => {
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
  jest.spyOn(console, 'error').mockImplementation();
  await expect(cmdTagAdd(['only-one'])).rejects.toThrow('exit');
  exit.mockRestore();
});

test('cmdTagRemove removes a tag', async () => {
  tag.removeTag.mockResolvedValue();
  const spy = jest.spyOn(console, 'log').mockImplementation();
  await cmdTagRemove(['work', 'dev']);
  expect(tag.removeTag).toHaveBeenCalledWith('work', 'dev');
  spy.mockRestore();
});

test('cmdTagList prints tags', async () => {
  tag.listTags.mockResolvedValue({ dev: ['work', 'side'], fun: ['games'] });
  const spy = jest.spyOn(console, 'log').mockImplementation();
  await cmdTagList([]);
  expect(spy).toHaveBeenCalledWith('dev: work, side');
  expect(spy).toHaveBeenCalledWith('fun: games');
  spy.mockRestore();
});

test('cmdTagList prints empty message', async () => {
  tag.listTags.mockResolvedValue({});
  const spy = jest.spyOn(console, 'log').mockImplementation();
  await cmdTagList([]);
  expect(spy).toHaveBeenCalledWith('No tags found.');
  spy.mockRestore();
});

test('cmdTagSearch lists sessions for tag', async () => {
  tag.getTagged.mockResolvedValue(['work', 'research']);
  const spy = jest.spyOn(console, 'log').mockImplementation();
  await cmdTagSearch(['dev']);
  expect(tag.getTagged).toHaveBeenCalledWith('dev');
  expect(spy).toHaveBeenCalledWith('Sessions tagged "dev":');
  spy.mockRestore();
});

test('cmdTagRename renames a tag', async () => {
  tag.renameTag.mockResolvedValue();
  const spy = jest.spyOn(console, 'log').mockImplementation();
  await cmdTagRename(['old', 'new']);
  expect(tag.renameTag).toHaveBeenCalledWith('old', 'new');
  expect(spy).toHaveBeenCalledWith('Renamed tag "old" to "new"');
  spy.mockRestore();
});
