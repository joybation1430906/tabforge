const { saveFlow, loadFlow, listFlows, deleteFlow, renameFlow } = require('./flow');

function cmdFlowSave(args) {
  const [name, ...steps] = args;
  if (!name || steps.length === 0) {
    console.log('Usage: tabforge flow save <name> <url1> [url2...]');
    return;
  }
  const flow = { name, steps, createdAt: new Date().toISOString() };
  saveFlow(name, flow);
  console.log(`Flow "${name}" saved with ${steps.length} step(s).`);
}

function cmdFlowList() {
  const flows = listFlows();
  if (flows.length === 0) { console.log('No flows saved.'); return; }
  flows.forEach(f => console.log(`  - ${f}`));
}

function cmdFlowShow(args) {
  const [name] = args;
  if (!name) { console.log('Usage: tabforge flow show <name>'); return; }
  const flow = loadFlow(name);
  if (!flow) { console.log(`Flow "${name}" not found.`); return; }
  console.log(`Flow: ${flow.name}`);
  console.log(`Created: ${flow.createdAt}`);
  flow.steps.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
}

function cmdFlowDelete(args) {
  const [name] = args;
  if (!name) { console.log('Usage: tabforge flow delete <name>'); return; }
  if (deleteFlow(name)) console.log(`Flow "${name}" deleted.`);
  else console.log(`Flow "${name}" not found.`);
}

function cmdFlowRename(args) {
  const [oldName, newName] = args;
  if (!oldName || !newName) { console.log('Usage: tabforge flow rename <old> <new>'); return; }
  if (renameFlow(oldName, newName)) console.log(`Flow renamed to "${newName}".`);
  else console.log(`Flow "${oldName}" not found.`);
}

function handleFlowCommand(sub, args) {
  switch (sub) {
    case 'save': return cmdFlowSave(args);
    case 'list': return cmdFlowList();
    case 'show': return cmdFlowShow(args);
    case 'delete': return cmdFlowDelete(args);
    case 'rename': return cmdFlowRename(args);
    default: console.log('Unknown flow command. Use: save, list, show, delete, rename');
  }
}

module.exports = { cmdFlowSave, cmdFlowList, cmdFlowShow, cmdFlowDelete, cmdFlowRename, handleFlowCommand };
