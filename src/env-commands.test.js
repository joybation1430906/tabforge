jest.mock('./env');

const env = require('./env');
const { cmdEnvSet, cmdEnvGet, cmdEnvRemove, cmdEnvList, handleEnvCommand } = require('./env-commands');

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
});

test('cmdEnvSet calls setEnv and logs', () => {
  env.setEnv.mockImplementation(() => {});
  cmdEnvSet(['MY_KEY', 'my_value']);
  expect(env.setEnv).toHaveBeenCalledWith('MY_KEY', 'my_value');
  expect(console.log).toHaveBeenCalledWith('Set env var: MY_KEY=my_value');
});

test('cmdEnvSet exits if args missing', () => {
  expect(() => cmdEnvSet([])).toThrow('exit');
});

test('cmdEnvGet logs value if found', () => {
  env.getEnv.mockReturnValue('hello');
  cmdEnvGet(['MY_KEY']);
  expect(console.log).toHaveBeenCalledWith('MY_KEY=hello');
});

test('cmdEnvGet logs not found message', () => {
  env.getEnv.mockReturnValue(undefined);
  cmdEnvGet(['MISSING']);
  expect(console.log).toHaveBeenCalledWith('Env var "MISSING" not found');
});

test('cmdEnvRemove logs removed message', () => {
  env.removeEnv.mockReturnValue(true);
  cmdEnvRemove(['MY_KEY']);
  expect(console.log).toHaveBeenCalledWith('Removed env var: MY_KEY');
});

test('cmdEnvList prints all vars', () => {
  env.listEnv.mockReturnValue({ FOO: 'bar', BAZ: 'qux' });
  cmdEnvList();
  expect(console.log).toHaveBeenCalledWith('FOO=bar');
  expect(console.log).toHaveBeenCalledWith('BAZ=qux');
});

test('cmdEnvList prints empty message when no vars', () => {
  env.listEnv.mockReturnValue({});
  cmdEnvList();
  expect(console.log).toHaveBeenCalledWith('No env vars set');
});

test('handleEnvCommand routes to correct handler', () => {
  env.listEnv.mockReturnValue({});
  handleEnvCommand('list', []);
  expect(env.listEnv).toHaveBeenCalled();
});

test('handleEnvCommand exits on unknown subcommand', () => {
  expect(() => handleEnvCommand('unknown', [])).toThrow('exit');
});
