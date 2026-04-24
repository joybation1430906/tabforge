const { mergeSessions, describeMerge } = require('./merge');

const sessionA = {
  name: 'work',
  browser: 'chrome',
  tabs: [
    { url: 'https://github.com', title: 'GitHub' },
    { url: 'https://google.com', title: 'Google' }
  ]
};

const sessionB = {
  name: 'extra',
  browser: 'firefox',
  tabs: [
    { url: 'https://google.com', title: 'Google' },
    { url: 'https://stackoverflow.com', title: 'SO' }
  ]
};

const sessionC = {
  name: 'docs',
  tabs: [
    { url: 'https://developer.mozilla.org', title: 'MDN' }
  ]
};

test('returns null for empty input', () => {
  expect(mergeSessions([])).toBeNull();
});

test('returns same session for single input', () => {
  const result = mergeSessions([sessionA]);
  expect(result.name).toBe('work');
  expect(result.tabs).toHaveLength(2);
});

test('merges two sessions, deduplicates tabs by url', () => {
  const result = mergeSessions([sessionA, sessionB]);
  expect(result.tabs).toHaveLength(3);
  const urls = result.tabs.map(t => t.url);
  expect(urls).toContain('https://github.com');
  expect(urls).toContain('https://google.com');
  expect(urls).toContain('https://stackoverflow.com');
});

test('later session overrides top-level keys', () => {
  const result = mergeSessions([sessionA, sessionB]);
  expect(result.name).toBe('extra');
  expect(result.browser).toBe('firefox');
});

test('merges three sessions', () => {
  const result = mergeSessions([sessionA, sessionB, sessionC]);
  expect(result.name).toBe('docs');
  expect(result.tabs).toHaveLength(4);
});

test('describeMerge lists changed keys and added tabs', () => {
  const changes = describeMerge(sessionA, sessionB);
  expect(changes.some(c => c.includes('"name"'))).toBe(true);
  expect(changes.some(c => c.includes('stackoverflow'))).toBe(true);
  // google.com already exists, should not appear as added
  const addedUrls = changes.filter(c => c.includes('tab added:'));
  expect(addedUrls.every(c => !c.includes('google.com'))).toBe(true);
});

test('describeMerge returns empty array when no differences', () => {
  const changes = describeMerge(sessionA, sessionA);
  expect(changes).toHaveLength(0);
});
