jest.mock('./replay');
const replay = require('./replay');
const {
  cmdReplayRecord,
  cmdReplayList,
  cmdReplayShow,
  cmdReplayDelete,
  cmdReplayRename,
  handleReplayCommand
} = require('./replay-commands');

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => console.log.mockRestore());

test('cmdReplayRecord shows usage with no args', () => {
  cmdReplayRecord([]);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Usage'));
});

test('cmdReplayRecord records and prints confirmation', () => {
  replay.recordReplay.mockReturnValue({ name: 'r1', stepCount: 2 });
  cmdReplayRecord(['r1', 'https://a.com', 'https://b.com']);
  expect(replay.recordReplay).toHaveBeenCalledWith('r1', [
    { step: 1, url: 'https://a.com' },
    { step: 2, url: 'https://b.com' }
  ]);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('r1'));
});

test('cmdReplayList prints empty message when none', () => {
  replay.listReplays.mockReturnValue([]);
  cmdReplayList();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No replays'));
});

test('cmdReplayList prints replay names', () => {
  replay.listReplays.mockReturnValue(['r1', 'r2']);
  cmdReplayList();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('r1'));
});

test('cmdReplayShow prints not found for missing', () => {
  replay.loadReplay.mockReturnValue(null);
  cmdReplayShow(['missing']);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('not found'));
});

test('cmdReplayShow prints replay details', () => {
  replay.loadReplay.mockReturnValue({ name: 'r1', createdAt: '2024-01-01', stepCount: 1, steps: [{ step: 1, url: 'https://x.com' }] });
  cmdReplayShow(['r1']);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('r1'));
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('https://x.com'));
});

test('cmdReplayDelete confirms deletion', () => {
  replay.deleteReplay.mockReturnValue(true);
  cmdReplayDelete(['r1']);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('deleted'));
});

test('cmdReplayRename confirms rename', () => {
  replay.renameReplay.mockReturnValue(true);
  cmdReplayRename(['old', 'new']);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('new'));
});

test('handleReplayCommand routes to correct handler', () => {
  replay.listReplays.mockReturnValue([]);
  handleReplayCommand('list', []);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No replays'));
});

test('handleReplayCommand handles unknown subcommand', () => {
  handleReplayCommand('fly', []);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Unknown'));
});
