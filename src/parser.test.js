const { validateConfig, parseSessionConfig } = require('./parser');
const path = require('path');
const fs = require('fs');
const os = require('os');
const yaml = require('js-yaml');

describe('validateConfig', () => {
  const validConfig = {
    session: 'work',
    tabs: [
      { url: 'https://github.com' },
      { url: 'https://example.com', title: 'Example', pinned: true },
    ],
  };

  test('returns normalized config for valid input', () => {
    const result = validateConfig(validConfig);
    expect(result.session).toBe('work');
    expect(result.browser).toBe('chrome');
    expect(result.tabs).toHaveLength(2);
    expect(result.tabs[1].pinned).toBe(true);
    expect(result.tabs[0].pinned).toBe(false);
  });

  test('throws if session is missing', () => {
    expect(() => validateConfig({ tabs: [{ url: 'https://a.com' }] })).toThrow('session');
  });

  test('throws if tabs array is missing', () => {
    expect(() => validateConfig({ session: 'test' })).toThrow('tabs');
  });

  test('throws if tabs array is empty', () => {
    expect(() => validateConfig({ session: 'test', tabs: [] })).toThrow('tabs');
  });

  test('throws if a tab has no url', () => {
    expect(() =>
      validateConfig({ session: 'test', tabs: [{ title: 'No URL' }] })
    ).toThrow('url');
  });

  test('throws if a tab has an invalid url', () => {
    expect(() =>
      validateConfig({ session: 'test', tabs: [{ url: 'not-a-url' }] })
    ).toThrow('invalid URL');
  });

  test('respects custom browser field', () => {
    const result = validateConfig({ ...validConfig, browser: 'firefox' });
    expect(result.browser).toBe('firefox');
  });

  test('throws if session is not a string', () => {
    expect(() =>
      validateConfig({ session: 42, tabs: [{ url: 'https://a.com' }] })
    ).toThrow('session');
  });

  test('throws if tabs is not an array', () => {
    expect(() =>
      validateConfig({ session: 'test', tabs: { url: 'https://a.com' } })
    ).toThrow('tabs');
  });
});

describe('parseSessionConfig', () => {
  test('parses a valid YAML file', () => {
    const tmp = path.join(os.tmpdir(), 'tabforge-test.yml');
    const data = yaml.dump({ session: 'tmp-session', tabs: [{ url: 'https://test.com' }] });
    fs.writeFileSync(tmp, data, 'utf8');
    const result = parseSessionConfig(tmp);
    expect(result.session).toBe('tmp-session');
    fs.unlinkSync(tmp);
  });

  test('throws if file does not exist', () => {
    expect(() => parseSessionConfig('/nonexistent/path.yml')).toThrow('not found');
  });

  test('throws if YAML is malformed', () => {
    const tmp = path.join(os.tmpdir(), 'tabforge-bad.yml');
    fs.writeFileSync(tmp, 'session: [unclosed', 'utf8');
    expect(() => parseSessionConfig(tmp)).toThrow();
    fs.unlinkSync(tmp);
  });
});
