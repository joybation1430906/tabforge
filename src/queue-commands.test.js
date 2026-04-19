let cmds, queue, launcher;

beforeEach(() => {
  jest.resetModules();
  jest.mock('./queue');
  jest.mock('./launcher');
  queue = require('./queue');
  launcher = require('./launcher');
  cmds = require('./queue-commands');
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => console.log.mockRestore());

test('cmdQueueAdd logs usage if missing args', () => {
  cmds.cmdQueueAdd([]);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Usage'));
});

test('cmdQueueAdd calls addToQueue', () => {
  queue.addToQueue = jest.fn().mockReturnValue(1);
  cmds.cmdQueueAdd(['work', 'https://a.com']);
  expect(queue.addToQueue).toHaveBeenCalledWith('work', 'https://a.com');
});

test('cmdQueueList lists all queues', () => {
  queue.listQueues = jest.fn().mockReturnValue(['work', 'home']);
  cmds.cmdQueueList([]);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('work'));
});

test('cmdQueueList shows items for named queue', () => {
  queue.loadQueue = jest.fn().mockReturnValue({ items: [{ url: 'https://a.com' }] });
  cmds.cmdQueueList(['work']);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('https://a.com'));
});

test('cmdQueueLaunch opens tabs', () => {
  queue.loadQueue = jest.fn().mockReturnValue({ items: [{ url: 'https://a.com' }, { url: 'https://b.com' }] });
  launcher.openTab = jest.fn();
  cmds.cmdQueueLaunch(['work']);
  expect(launcher.openTab).toHaveBeenCalledTimes(2);
});

test('cmdQueueDelete calls deleteQueue', () => {
  queue.deleteQueue = jest.fn().mockReturnValue(true);
  cmds.cmdQueueDelete(['work']);
  expect(queue.deleteQueue).toHaveBeenCalledWith('work');
});

test('handleQueueCommand routes unknown sub', () => {
  cmds.handleQueueCommand('nope', []);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Unknown'));
});
