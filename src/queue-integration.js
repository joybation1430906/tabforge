const { handleQueueCommand } = require('./queue-commands');

/**
 * Integrate queue commands into the main CLI dispatch.
 * Call this from the main index/cli with (args) where args[0] is 'queue'.
 */
function handleQueueIntegration(args) {
  const sub = args[1];
  const rest = args.slice(2);
  if (!sub) {
    console.log('Available queue commands: add, remove, list, launch, delete');
    return;
  }
  handleQueueCommand(sub, rest);
}

module.exports = { handleQueueIntegration };
