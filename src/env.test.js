const fs = require('fs');
const path = require('path');
const os = require('os');

jest.mock('fs');

const ENV_FILE = path.join(os.homedir(), '.tabforge', 'env.json');

function getModule() {
  jest.resetModules();
  return require('./env');
}

beforeEach(() => {
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue(JSON.stringify({ API_URL: 'https://example.com' }));
  fs.writeFileSync.mockImplementation(() => {});
  fs.mkdirSync.mockImplementation(() => {});
});

test('loadEnv returns parsed env object', () => {
  const { loadEnv } = getModule();
  const env = loadEnv();
  expect(env).toEqual({ API_URL: 'https://example.com' });
});

test('setEnv adds a new key', () => {
  const { setEnv } = getModule();
  setEnv('TOKEN', 'abc123');
  const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
  expect(written.TOKEN).toBe('abc123');
});

test('getEnv returns value for existing key', () => {
  const { getEnv } = getModule();
  expect(getEnv('API_URL')).toBe('https://example.com');
});

test('getEnv returns undefined for missing key', () => {
  const { getEnv } = getModule();
  expect(getEnv('MISSING')).toBeUndefined();
});

test('removeEnv deletes existing key', () => {
  const { removeEnv } = getModule();
  const result = removeEnv('API_URL');
  expect(result).toBe(true);
  const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
  expect(written.API_URL).toBeUndefined();
});

test('removeEnv returns false for missing key', () => {
  const { removeEnv } = getModule();
  expect(removeEnv('NOPE')).toBe(false);
});

test('resolveEnvVars replaces known variables', () => {
  const { resolveEnvVars } = getModule();
  const result = resolveEnvVars('url: ${API_URL}/path');
  expect(result).toBe('url: https://example.com/path');
});

test('resolveEnvVars leaves unknown variables as-is', () => {
  const { resolveEnvVars } = getModule();
  const result = resolveEnvVars('${UNKNOWN_VAR}');
  expect(result).toBe('${UNKNOWN_VAR}');
});
