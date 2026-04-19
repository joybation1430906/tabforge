const { filterByTag, filterBySearch, filterByDate, applyFilters } = require('./filter');

const items = [
  { name: 'GitHub', url: 'https://github.com', tags: ['dev', 'git'], createdAt: '2024-01-10' },
  { name: 'MDN', url: 'https://developer.mozilla.org', tags: ['docs'], createdAt: '2024-03-15' },
  { name: 'Google', url: 'https://google.com', tags: [], createdAt: '2023-12-01' },
];

test('filterByTag returns items with matching tag', () => {
  const result = filterByTag(items, 'dev');
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('GitHub');
});

test('filterByTag returns empty if no match', () => {
  expect(filterByTag(items, 'nope')).toHaveLength(0);
});

test('filterBySearch matches name', () => {
  const result = filterBySearch(items, 'github');
  expect(result[0].name).toBe('GitHub');
});

test('filterBySearch matches url', () => {
  const result = filterBySearch(items, 'mozilla');
  expect(result[0].name).toBe('MDN');
});

test('filterByDate filters by since date', () => {
  const result = filterByDate(items, '2024-01-01');
  expect(result).toHaveLength(2);
});

test('applyFilters combines tag and search', () => {
  const result = applyFilters(items, { tag: 'dev', search: 'github' });
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('GitHub');
});

test('applyFilters with no opts returns all', () => {
  expect(applyFilters(items, {})).toHaveLength(3);
});
