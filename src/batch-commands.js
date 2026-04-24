const {
  createBatch,
  loadBatch,
  listBatches,
  deleteBatch,
  addSessionToBatch,
  removeSessionFromBatch
} = require('./batch');

function cmdBatchCreate(args) {
  const [name] = args;
  if (!name) { console.log('Usage: batch create <name>'); return; }
  const batch = createBatch(name, []);
  console.log(`Batch '${batch.name}' created.`);
}

function cmdBatchAdd(args) {
  const [name, session] = args;
  if (!name || !session) { console.log('Usage: batch add <name> <session>'); return; }
  const batch = addSessionToBatch(name, session);
  if (!batch) { console.log(`Batch '${name}' not found.`); return; }
  console.log(`Added '${session}' to batch '${name}'.`);
}

function cmdBatchRemove(args) {
  const [name, indexStr] = args;
  if (!name || indexStr === undefined) { console.log('Usage: batch remove <name> <index>'); return; }
  const index = parseInt(indexStr, 10);
  const batch = removeSessionFromBatch(name, index);
  if (!batch) { console.log(`Could not remove session at index ${index} from '${name}'.`); return; }
  console.log(`Removed session at index ${index} from batch '${name}'.`);
}

function cmdBatchList() {
  const batches = listBatches();
  if (!batches.length) { console.log('No batches found.'); return; }
  batches.forEach(b => console.log(`  ${b}`));
}

function cmdBatchShow(args) {
  const [name] = args;
  if (!name) { console.log('Usage: batch show <name>'); return; }
  const batch = loadBatch(name);
  if (!batch) { console.log(`Batch '${name}' not found.`); return; }
  console.log(`Batch: ${batch.name}`);
  console.log(`Created: ${batch.createdAt}`);
  if (!batch.sessions.length) { console.log('  (no sessions)'); return; }
  batch.sessions.forEach((s, i) => console.log(`  [${i}] ${s}`));
}

function cmdBatchDelete(args) {
  const [name] = args;
  if (!name) { console.log('Usage: batch delete <name>'); return; }
  const ok = deleteBatch(name);
  if (!ok) { console.log(`Batch '${name}' not found.`); return; }
  console.log(`Batch '${name}' deleted.`);
}

function handleBatchCommand(sub, args) {
  switch (sub) {
    case 'create': return cmdBatchCreate(args);
    case 'add':    return cmdBatchAdd(args);
    case 'remove': return cmdBatchRemove(args);
    case 'list':   return cmdBatchList();
    case 'show':   return cmdBatchShow(args);
    case 'delete': return cmdBatchDelete(args);
    default: console.log('Unknown batch subcommand: ' + sub);
  }
}

module.exports = {
  cmdBatchCreate,
  cmdBatchAdd,
  cmdBatchRemove,
  cmdBatchList,
  cmdBatchShow,
  cmdBatchDelete,
  handleBatchCommand
};
