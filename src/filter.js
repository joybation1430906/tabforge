const { loadBookmarks } = require('./bookmark');
const { loadTags } = require('./tag');

function filterByTag(items, tag) {
  return items.filter(item => Array.isArray(item.tags) && item.tags.includes(tag));
}

function filterBySearch(items, query) {
  const q = query.toLowerCase();
  return items.filter(item =>
    (item.name && item.name.toLowerCase().includes(q)) ||
    (item.url && item.url.toLowerCase().includes(q)) ||
    (item.description && item.description.toLowerCase().includes(q))
  );
}

function filterByDate(items, since) {
  const sinceDate = new Date(since);
  return items.filter(item => item.createdAt && new Date(item.createdAt) >= sinceDate);
}

function applyFilters(items, { tag, search, since } = {}) {
  let result = [...items];
  if (tag) result = filterByTag(result, tag);
  if (search) result = filterBySearch(result, search);
  if (since) result = filterByDate(result, since);
  return result;
}

function filterBookmarks(opts) {
  const bookmarks = loadBookmarks();
  return applyFilters(bookmarks, opts);
}

module.exports = { filterByTag, filterBySearch, filterByDate, applyFilters, filterBookmarks };
