const { recordReplay, loadReplay, listReplays, deleteReplay, renameReplay } = require('./replay');

function cmdReplayRecord(args) {
  const [name, ...rawSteps] = args;
  if (!name || rawSteps.length === 0) {
    console.log('Usage: tabforge replay record <name> <url1> [url2...]');
    return;
  }
  const steps = rawSteps.map((url, i) => ({ step: i + 1, url }));
  const replay = recordReplay(name, steps);
  console.log(`Replay "${name}" recorded with ${replay.stepCount} step(s).`);
}

function cmdReplayList() {
  const replays = listReplays();
  if (replays.length === 0) {
    console.log('No replays saved.');
    return;
  }
  console.log('Saved replays:');
  replays.forEach(r => console.log(`  - ${r}`));
}

function cmdReplayShow(args) {
  const [name] = args;
  if (!name) { console.log('Usage: tabforge replay show <name>'); return; }
  const replay = loadReplay(name);
  if (!replay) { console.log(`Replay "${name}" not found.`); return; }
  console.log(`Replay: ${replay.name}`);
  console.log(`Created: ${replay.createdAt}`);
  console.log(`Steps (${replay.stepCount}):`);
  replay.steps.forEach(s => console.log(`  ${s.step}. ${s.url}`));
}

function cmdReplayDelete(args) {
  const [name] = args;
  if (!name) { console.log('Usage: tabforge replay delete <name>'); return; }
  const ok = deleteReplay(name);
  console.log(ok ? `Replay "${name}" deleted.` : `Replay "${name}" not found.`);
}

function cmdReplayRename(args) {
  const [oldName, newName] = args;
  if (!oldName || !newName) {
    console.log('Usage: tabforge replay rename <old> <new>');
    return;
  }
  const ok = renameReplay(oldName, newName);
  console.log(ok ? `Replay renamed to "${newName}".` : `Replay "${oldName}" not found.`);
}

function handleReplayCommand(sub, args) {
  switch (sub) {
    case 'record': return cmdReplayRecord(args);
    case 'list': return cmdReplayList();
    case 'show': return cmdReplayShow(args);
    case 'delete': return cmdReplayDelete(args);
    case 'rename': return cmdReplayRename(args);
    default: console.log(`Unknown replay subcommand: ${sub}`);
  }
}

module.exports = {
  cmdReplayRecord,
  cmdReplayList,
  cmdReplayShow,
  cmdReplayDelete,
  cmdReplayRename,
  handleReplayCommand
};
