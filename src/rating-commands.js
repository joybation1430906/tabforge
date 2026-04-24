const { addRating, removeRating, getRating, listRatings, topRated } = require('./rating');

function cmdRatingAdd(args) {
  const [name, scoreStr, ...rest] = args;
  if (!name || !scoreStr) return console.log('Usage: tabforge rating add <name> <score> [note]');
  const score = parseInt(scoreStr, 10);
  if (isNaN(score)) return console.log('Score must be a number between 1 and 5');
  try {
    const entry = addRating(name, score, rest.join(' '));
    console.log(`Rated "${entry.name}": ${entry.score}/5${entry.note ? ` — ${entry.note}` : ''}`);
  } catch (e) {
    console.log(e.message);
  }
}

function cmdRatingRemove(args) {
  const [name] = args;
  if (!name) return console.log('Usage: tabforge rating remove <name>');
  try {
    removeRating(name);
    console.log(`Removed rating for "${name}"`);
  } catch (e) {
    console.log(e.message);
  }
}

function cmdRatingShow(args) {
  const [name] = args;
  if (!name) return console.log('Usage: tabforge rating show <name>');
  const entry = getRating(name);
  if (!entry) return console.log(`No rating found for "${name}"`);
  console.log(`${entry.name}: ${entry.score}/5${entry.note ? ` — ${entry.note}` : ''}`);
}

function cmdRatingList() {
  const ratings = listRatings();
  if (!ratings.length) return console.log('No ratings found.');
  ratings.forEach(r => console.log(`${r.score}/5  ${r.name}${r.note ? ` — ${r.note}` : ''}`));
}

function cmdRatingTop(args) {
  const limit = parseInt(args[0], 10) || 5;
  const top = topRated(limit);
  if (!top.length) return console.log('No ratings found.');
  console.log(`Top ${limit} rated:`);
  top.forEach((r, i) => console.log(`${i + 1}. ${r.name} — ${r.score}/5${r.note ? ` (${r.note})` : ''}`));
}

function handleRatingCommand(sub, args) {
  switch (sub) {
    case 'add': return cmdRatingAdd(args);
    case 'remove': return cmdRatingRemove(args);
    case 'show': return cmdRatingShow(args);
    case 'list': return cmdRatingList();
    case 'top': return cmdRatingTop(args);
    default: console.log('Unknown rating subcommand. Use: add, remove, show, list, top');
  }
}

module.exports = { cmdRatingAdd, cmdRatingRemove, cmdRatingShow, cmdRatingList, cmdRatingTop, handleRatingCommand };
