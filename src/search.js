const { loadBookmarks } = require('./bookmark');
const { loadHistory } = require('./history');
const { loadFavorites } = require('./favorite');
const { loadSnippets } = require('./snippet');

async function searchAll(query) {
  if (!query || query.trim() === '') throw new Error('Search query required');
  const q = query.toLowerCase();
  const results = [];

  const bookmarks = await loadBookmarks();
  for (const b of bookmarks) {
    if (b.url.toLowerCase().includes(q) || (b.title && b.title.toLowerCase().includes(q))) {
      results.push({ type: 'bookmark', name: b.title || b.url, value: b.url });
    }
  }

  const history = await loadHistory();
  for (const h of history) {
    if (h.file && h.file.toLowerCase().includes(q)) {
      results.push({ type: 'history', name: h.file, value: h.launchedAt });
    }
  }

  const favorites = await loadFavorites();
  for (const f of favorites) {
    if (f.name.toLowerCase().includes(q) || (f.url && f.url.toLowerCase().includes(q))) {
      results.push({ type: 'favorite', name: f.name, value: f.url });
    }
  }

  const snippets = await loadSnippets();
  for (const s of snippets) {
    if (s.name.toLowerCase().includes(q) || (s.content && s.content.toLowerCase().includes(q))) {
      results.push({ type: 'snippet', name: s.name, value: s.content });
    }
  }

  return results;
}

function formatResults(results) {
  if (results.length === 0) return 'No results found.';
  return results.map(r => `[${r.type}] ${r.name}${r.value ? ' — ' + r.value : ''}`).join('\n');
}

module.exports = { searchAll, formatResults };
