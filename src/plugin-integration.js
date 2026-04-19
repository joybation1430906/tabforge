const { listPlugins, loadPlugin } = require('./plugin');
const path = require('path');

function loadEnabledPlugins() {
  return listPlugins()
    .map(name => loadPlugin(name))
    .filter(p => p && p.enabled);
}

function runPluginHook(hookName, context) {
  const plugins = loadEnabledPlugins();
  for (const plugin of plugins) {
    try {
      const mod = require(path.resolve(plugin.entry));
      if (typeof mod[hookName] === 'function') {
        mod[hookName](context);
      }
    } catch (e) {
      console.warn(`Plugin '${plugin.name}' hook '${hookName}' failed: ${e.message}`);
    }
  }
}

module.exports = { loadEnabledPlugins, runPluginHook };
