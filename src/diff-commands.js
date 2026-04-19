const path = require('path');
const { loadSession } = require('./session');
const { diffSessions, formatDiff, diffFromFiles } = require('./diff');

function cmdDiff(args) {
  if (args.length < 2) {
    console.error('Usage: tabforge diff <sessionA> <sessionB>');
    process.exit(1);
  }
  const [nameA, nameB] = args;
  let sessionA, sessionB;
  try {
    sessionA = loadSession(nameA);
  } catch (e) {
    console.error(`Could not load session: ${nameA}`);
    process.exit(1);
  }
  try {
    sessionB = loadSession(nameB);
  } catch (e) {
    console.error(`Could not load session: ${nameB}`);
    process.exit(1);
  }
  const diff = diffSessions(sessionA, sessionB);
  console.log(formatDiff(diff, nameA, nameB));
}

function handleDiffCommand(args) {
  cmdDiff(args);
}

module.exports = { cmdDiff, handleDiffCommand };
