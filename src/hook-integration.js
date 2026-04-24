const { execSync } = require('child_process');
const { getHooksByEvent } = require('./hook');

function runHooks(event, context = {}) {
  const hooks = getHooksByEvent(event);
  if (hooks.length === 0) return;

  const env = Object.assign({}, process.env);
  for (const [k, v] of Object.entries(context)) {
    env[`TABFORGE_${k.toUpperCase()}`] = String(v);
  }

  for (const hook of hooks) {
    try {
      execSync(hook.command, { env, stdio: 'inherit' });
    } catch (err) {
      console.error(`Hook '${hook.name}' failed: ${err.message}`);
    }
  }
}

function handleHookIntegration(event, context) {
  runHooks(event, context);
}

module.exports = { runHooks, handleHookIntegration };
