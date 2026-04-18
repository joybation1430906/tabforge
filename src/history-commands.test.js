jest.mock('./history');
const { getHistory, clearHistory, deleteHistoryEntry } = require('./history');
const { cmdHistory, cmdHistoryClear, cmdHistoryDelete } = require('./history-commands');

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

test('cmdHistory prints entries', () => {
  getHistory.mockReturnValue([
    { id: 1, timestamp: new Date().toISOString(), configPath: '/a/b.yaml', urls: ['https://x.com'], count: 1 }
  ]);
  cmdHistory({});
  expect(console.log).toHaveBeenCalled();
});

test('cmdHistory shows empty message', () => {
  getHistory.mockReturnValue([]);
  cmdHistory({});
  expect(console.log).toHaveBeenCalledWith('No launch history found.');
});

test('cmdHistoryClear calls clearHistory', () => {
  cmdHistoryClear();
  expect(clearHistory).toHaveBeenCalled();
  expect(console.log).toHaveBeenCalledWith('History cleared.');
});

test('cmdHistoryDelete deletes by id', () => {
  deleteHistoryEntry.mockReturnValue(true);
  cmdHistoryDelete({ _: ['1'] });
  expect(deleteHistoryEntry).toHaveBeenCalledWith(1);
});

test('cmdHistoryDelete exits on missing id', () => {
  const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
  expect(() => cmdHistoryDelete({ _: [] })).toThrow('exit');
  mockExit.mockRestore();
});
