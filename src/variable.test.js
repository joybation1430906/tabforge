const { setVariable, getVariable, removeVariable, listVariables, interpolate, loadVariables } = require('./variable');
const fs = require('fs');
const os = require('os');
const path = require('path');

const VARIABLES_FILE = path.join(os.homedir(), '.tabforge', 'variables.json');

beforeEach(() => {
  if (fs.existsSync(VARIABLES_FILE)) fs.writeFileSync(VARIABLES_FILE, '{}');
});

test('setVariable stores a value', () => {
  setVariable('env', 'production');
  expect(getVariable('env')).toBe('production');
});

test('getVariable returns undefined for missing key', () => {
  expect(getVariable('nonexistent')).toBeUndefined();
});

test('removeVariable deletes a key', () => {
  setVariable('foo', 'bar');
  const result = removeVariable('foo');
  expect(result).toBe(true);
  expect(getVariable('foo')).toBeUndefined();
});

test('removeVariable returns false for missing key', () => {
  expect(removeVariable('ghost')).toBe(false);
});

test('listVariables returns all variables', () => {
  setVariable('a', '1');
  setVariable('b', '2');
  const vars = listVariables();
  expect(vars.a).toBe('1');
  expect(vars.b).toBe('2');
});

test('interpolate replaces known variables', () => {
  setVariable('host', 'localhost');
  const result = interpolate('http://{{host}}:3000');
  expect(result).toBe('http://localhost:3000');
});

test('interpolate leaves unknown variables intact', () => {
  const result = interpolate('http://{{unknown}}/path');
  expect(result).toBe('http://{{unknown}}/path');
});

test('interpolate uses extra vars over stored vars', () => {
  setVariable('port', '8080');
  const result = interpolate('{{port}}', { port: '9090' });
  expect(result).toBe('9090');
});
