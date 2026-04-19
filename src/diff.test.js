const { diffSessions, formatDiff } = require('./diff');

const sessionA = {
  tabs: [
    { url: 'https://example.com' },
    { url: 'https://github.com' },
  ]
};

const sessionB = {
  tabs: [
    { url: 'https://github.com' },
    { url: 'https://openai.com' },
  ]
};

test('diffSessions finds added urls', () => {
  const diff = diffSessions(sessionA, sessionB);
  expect(diff.added).toContain('https://openai.com');
});

test('diffSessions finds removed urls', () => {
  const diff = diffSessions(sessionA, sessionB);
  expect(diff.removed).toContain('https://example.com');
});

test('diffSessions finds kept urls', () => {
  const diff = diffSessions(sessionA, sessionB);
  expect(diff.kept).toContain('https://github.com');
});

test('formatDiff shows no differences when sessions are equal', () => {
  const diff = diffSessions(sessionA, sessionA);
  const output = formatDiff(diff, 'a', 'a');
  expect(output).toContain('No differences found.');
});

test('formatDiff includes added and removed sections', () => {
  const diff = diffSessions(sessionA, sessionB);
  const output = formatDiff(diff, 'a', 'b');
  expect(output).toContain('Added:');
  expect(output).toContain('Removed:');
  expect(output).toContain('https://openai.com');
  expect(output).toContain('https://example.com');
});

test('diffSessions handles empty sessions', () => {
  const diff = diffSessions({}, {});
  expect(diff.added).toHaveLength(0);
  expect(diff.removed).toHaveLength(0);
  expect(diff.kept).toHaveLength(0);
});
