jest.mock('./flow');
const flow = require('./flow');
const { cmdFlowSave, cmdFlowList, cmdFlowShow, cmdFlowDelete, cmdFlowRename, handleFlowCommand } = require('./flow-commands');

beforeEach(() => jest.clearAllMocks());

test('cmdFlowSave saves and logs', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdFlowSave(['dev', 'https://github.com', 'https://jira.com']);
  expect(flow.saveFlow).toHaveBeenCalledWith('dev', expect.objectContaining({ steps: ['https://github.com', 'https://jira.com'] }));
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('saved'));
  spy.mockRestore();
});

test('cmdFlowList lists flows', () => {
  flow.listFlows.mockReturnValue(['dev', 'research']);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdFlowList();
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('dev'));
  spy.mockRestore();
});

test('cmdFlowShow shows flow steps', () => {
  flow.loadFlow.mockReturnValue({ name: 'dev', steps: ['https://a.com'], createdAt: '2024-01-01' });
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdFlowShow(['dev']);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('dev'));
  spy.mockRestore();
});

test('cmdFlowDelete deletes flow', () => {
  flow.deleteFlow.mockReturnValue(true);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdFlowDelete(['dev']);
  expect(flow.deleteFlow).toHaveBeenCalledWith('dev');
  spy.mockRestore();
});

test('handleFlowCommand routes correctly', () => {
  flow.listFlows.mockReturnValue([]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleFlowCommand('list', []);
  expect(flow.listFlows).toHaveBeenCalled();
  spy.mockRestore();
});
