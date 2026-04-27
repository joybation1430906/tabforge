const { saveMilestone, loadMilestone, listMilestones, deleteMilestone, renameMilestone } = require('./milestone');

function cmdMilestoneSave(args) {
  const [name, ...rest] = args;
  if (!name) { console.log('Usage: milestone save <name> [description]'); return; }
  const description = rest.join(' ') || '';
  const m = saveMilestone(name, { description });
  console.log(`Milestone '${m.name}' saved (${m.createdAt})`);
}

function cmdMilestoneList() {
  const names = listMilestones();
  if (!names.length) { console.log('No milestones saved.'); return; }
  names.forEach(n => {
    const m = loadMilestone(n);
    const desc = m && m.description ? ` — ${m.description}` : '';
    console.log(`  ${n}${desc}`);
  });
}

function cmdMilestoneShow(args) {
  const [name] = args;
  if (!name) { console.log('Usage: milestone show <name>'); return; }
  const m = loadMilestone(name);
  if (!m) { console.log(`Milestone '${name}' not found.`); return; }
  console.log(JSON.stringify(m, null, 2));
}

function cmdMilestoneDelete(args) {
  const [name] = args;
  if (!name) { console.log('Usage: milestone delete <name>'); return; }
  const ok = deleteMilestone(name);
  console.log(ok ? `Milestone '${name}' deleted.` : `Milestone '${name}' not found.`);
}

function cmdMilestoneRename(args) {
  const [oldName, newName] = args;
  if (!oldName || !newName) { console.log('Usage: milestone rename <old> <new>'); return; }
  const ok = renameMilestone(oldName, newName);
  console.log(ok ? `Renamed '${oldName}' to '${newName}'.` : `Milestone '${oldName}' not found.`);
}

function handleMilestoneCommand(sub, args) {
  switch (sub) {
    case 'save':   return cmdMilestoneSave(args);
    case 'list':   return cmdMilestoneList();
    case 'show':   return cmdMilestoneShow(args);
    case 'delete': return cmdMilestoneDelete(args);
    case 'rename': return cmdMilestoneRename(args);
    default: console.log('Unknown milestone subcommand:', sub);
  }
}

module.exports = {
  cmdMilestoneSave,
  cmdMilestoneList,
  cmdMilestoneShow,
  cmdMilestoneDelete,
  cmdMilestoneRename,
  handleMilestoneCommand
};
