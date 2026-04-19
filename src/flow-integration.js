const { loadFlow } = require('./flow');
const { openTab } = require('./launcher');

async function launchFlow(name, options = {}) {
  const flow = loadFlow(name);
  if (!flow) {
    console.log(`Flow "${name}" not found.`);
    return false;
  }
  console.log(`Launching flow "${name}" (${flow.steps.length} tabs)...`);
  for (const url of flow.steps) {
    await openTab(url, options);
  }
  console.log('Flow launched.');
  return true;
}

function handleFlowIntegration(args) {
  const [name, ...rest] = args;
  const browser = rest.find(a => a.startsWith('--browser='))?.split('=')[1];
  if (!name) { console.log('Usage: tabforge flow launch <name> [--browser=<browser>]'); return; }
  launchFlow(name, { browser });
}

module.exports = { launchFlow, handleFlowIntegration };
