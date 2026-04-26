const { cmdIntentSave, cmdIntentList, cmdIntentShow, cmdIntentDelete, cmdIntentRename, handleIntentCommand } = require('./intent-commands');

const intentStore = {};
jest.mock('./intent', () => ({
  saveIntent: (name, intent) => { intentStore[name] = intent; },
  loadIntent: (name) => intentStore[name] || null,
  listIntents: () => Object.keys(intentStore),
  deleteIntent: (name) => { if (!intentStore[name]) return false; delete intentStore[name]; return true; },
  renameIntent: (oldName, newName) => {
    if (!intentStore[oldName]) return false;
    intentStore[newName] = { ...intentStore[oldName], name: newName };
    delete intentStore[oldName];
    return true;
  },
}));

beforeEach(() => { Object.keys(intentStore).forEach(k => delete intentStore[k]); });

test('cmdIntentSave saves and logs', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdIntentSave(['research', 'https://research.com', 'my research']);
  expect(intentStore['research']).toBeDefined();
  expect(intentStore['research'].url).toBe('https://research.com');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('research'));
  spy.mockRestore();
});

test('cmdIntentSave shows usage if args missing', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdIntentSave(['onlyname']);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('Usage'));
  spy.mockRestore();
});

test('cmdIntentList lists intents', () => {
  intentStore['x'] = { name: 'x', url: 'https://x.com', description: '' };
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdIntentList();
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('x'));
  spy.mockRestore();
});

test('cmdIntentList shows empty message', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdIntentList();
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('No intents'));
  spy.mockRestore();
});

test('cmdIntentShow shows intent JSON', () => {
  intentStore['show'] = { name: 'show', url: 'https://show.com' };
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdIntentShow(['show']);
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

test('cmdIntentDelete deletes intent', () => {
  intentStore['gone'] = { name: 'gone', url: 'https://gone.com' };
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdIntentDelete(['gone']);
  expect(intentStore['gone']).toBeUndefined();
  spy.mockRestore();
});

test('handleIntentCommand dispatches rename', () => {
  intentStore['alpha'] = { name: 'alpha', url: 'https://alpha.com' };
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleIntentCommand('rename', ['alpha', 'beta']);
  expect(intentStore['beta']).toBeDefined();
  spy.mockRestore();
});

test('handleIntentCommand handles unknown subcommand', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleIntentCommand('fly', []);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('Unknown'));
  spy.mockRestore();
});
