const { saveWorkspace, loadWorkspace, listWorkspaces, deleteWorkspace, renameWorkspace } = require('./workspace');

function cmdWorkspaceSave(args) {
  const name = args[0];
  const description = args[1] || '';
  if (!name) { console.error('Usage: tabforge workspace save <name> [description]'); process.exit(1); }
  saveWorkspace(name, { description, tabs: [] });
  console.log(`Workspace '${name}' saved.`);
}

function cmdWorkspaceList() {
  const workspaces = listWorkspaces();
  if (!workspaces.length) { console.log('No workspaces found.'); return; }
  workspaces.forEach(name => {
    const ws = loadWorkspace(name);
    const desc = ws && ws.description ? ` — ${ws.description}` : '';
    console.log(`  ${name}${desc}`);
  });
}

function cmdWorkspaceShow(args) {
  const name = args[0];
  if (!name) { console.error('Usage: tabforge workspace show <name>'); process.exit(1); }
  const ws = loadWorkspace(name);
  if (!ws) { console.error(`Workspace '${name}' not found.`); process.exit(1); }
  console.log(JSON.stringify(ws, null, 2));
}

function cmdWorkspaceDelete(args) {
  const name = args[0];
  if (!name) { console.error('Usage: tabforge workspace delete <name>'); process.exit(1); }
  const ok = deleteWorkspace(name);
  if (!ok) { console.error(`Workspace '${name}' not found.`); process.exit(1); }
  console.log(`Workspace '${name}' deleted.`);
}

function cmdWorkspaceRename(args) {
  const [oldName, newName] = args;
  if (!oldName || !newName) { console.error('Usage: tabforge workspace rename <old> <new>'); process.exit(1); }
  const ok = renameWorkspace(oldName, newName);
  if (!ok) { console.error(`Workspace '${oldName}' not found.`); process.exit(1); }
  console.log(`Workspace '${oldName}' renamed to '${newName}'.`);
}

function handleWorkspaceCommand(sub, args) {
  switch (sub) {
    case 'save': return cmdWorkspaceSave(args);
    case 'list': return cmdWorkspaceList();
    case 'show': return cmdWorkspaceShow(args);
    case 'delete': return cmdWorkspaceDelete(args);
    case 'rename': return cmdWorkspaceRename(args);
    default: console.error(`Unknown workspace command: ${sub}`); process.exit(1);
  }
}

module.exports = { cmdWorkspaceSave, cmdWorkspaceList, cmdWorkspaceShow, cmdWorkspaceDelete, cmdWorkspaceRename, handleWorkspaceCommand };
