const { handleRatingCommand } = require('./rating-commands');
const { getRating } = require('./rating');

/**
 * Attaches rating info to a session object if a rating exists.
 * @param {object} session
 * @param {string} name
 * @returns {object}
 */
function attachRating(session, name) {
  const rating = getRating(name);
  if (!rating) return session;
  return { ...session, _rating: { score: rating.score, note: rating.note } };
}

/**
 * Handles 'tabforge rating <sub> [...args]' from the main CLI dispatcher.
 * @param {string[]} argv
 */
function handleRatingIntegration(argv) {
  const [sub, ...args] = argv;
  handleRatingCommand(sub, args);
}

module.exports = { attachRating, handleRatingIntegration };
