const { loadQueue, listQueues, deleteQueue, addToQueue, removeFromQueue } = require('./queue');
const { openTab } = require('./launcher');

function cmdQueueAdd(args) {
  const [name, url] = args;
  if (!name || !url) return console.log('Usage: queue add <name> <url>');
  const count = addToQueue(name, url);
  console.log(`Added to queue "${name}" (${count} items)`);
}

function cmdQueueRemove(args) {
  const [name, index] = args;
  if (!name || index === undefined) return console.log('Usage: queue remove <name> <index>');
  const ok = removeFromQueue(name, parseInt(index));
  console.log(ok ? `Removed item ${index} from "${name}"` : 'Item not found');
}

function cmdQueueList(args) {
  const [name] = args;
  if (name) {
    const queue = loadQueue(name);
    if (!queue) return console.log(`Queue "${name}" not found`);
    if (!queue.items.length) return console.log('Queue is empty');
    queue.items.forEach((item, i) => console.log(`  [${i}] ${item.url}`));
  } else {
    const queues = listQueues();
    if (!queues.length) return console.log('No queues found');
    queues.forEach(q => console.log(`  ${q}`));
  }
}

function cmdQueueLaunch(args) {
  const [name, browser] = args;
  if (!name) return console.log('Usage: queue launch <name> [browser]');
  const queue = loadQueue(name);
  if (!queue) return console.log(`Queue "${name}" not found`);
  if (!queue.items.length) return console.log('Queue is empty');
  queue.items.forEach(item => openTab(item.url, browser || 'default'));
  console.log(`Launched ${queue.items.length} tabs from queue "${name}"`);
}

function cmdQueueDelete(args) {
  const [name] = args;
  if (!name) return console.log('Usage: queue delete <name>');
  const ok = deleteQueue(name);
  console.log(ok ? `Deleted queue "${name}"` : `Queue "${name}" not found`);
}

function handleQueueCommand(sub, args) {
  const cmds = { add: cmdQueueAdd, remove: cmdQueueRemove, list: cmdQueueList, launch: cmdQueueLaunch, delete: cmdQueueDelete };
  const fn = cmds[sub];
  if (!fn) return console.log(`Unknown queue command: ${sub}`);
  fn(args);
}

module.exports = { cmdQueueAdd, cmdQueueRemove, cmdQueueList, cmdQueueLaunch, cmdQueueDelete, handleQueueCommand };
