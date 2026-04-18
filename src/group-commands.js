const { saveGroup, loadGroup, listGroups, deleteGroup, groupToYaml } = require('./group');

function cmdGroupSave(name, urls, opts = {}) {
  if (!name) throw new Error('Group name is required');
  if (!urls || urls.length === 0) throw new Error('At least one URL is required');
  const group = { name, urls, description: opts.description || '', createdAt: new Date().toISOString() };
  saveGroup(name, group);
  console.log(`Group '${name}' saved with ${urls.length} URL(s).`);
}

function cmdGroupList() {
  const groups = listGroups();
  if (groups.length === 0) {
    console.log('No groups saved.');
    return;
  }
  groups.forEach(g => console.log(`  ${g}`));
}

function cmdGroupShow(name) {
  if (!name) throw new Error('Group name is required');
  const group = loadGroup(name);
  console.log(groupToYaml(group));
}

function cmdGroupDelete(name) {
  if (!name) throw new Error('Group name is required');
  deleteGroup(name);
  console.log(`Group '${name}' deleted.`);
}

function handleGroupCommand(args) {
  const [sub, ...rest] = args;
  switch (sub) {
    case 'save': {
      const name = rest[0];
      const urls = rest.slice(1);
      cmdGroupSave(name, urls);
      break;
    }
    case 'list':
      cmdGroupList();
      break;
    case 'show':
      cmdGroupShow(rest[0]);
      break;
    case 'delete':
      cmdGroupDelete(rest[0]);
      break;
    default:
      console.log('Usage: tabforge group <save|list|show|delete> [args]');
  }
}

module.exports = { cmdGroupSave, cmdGroupList, cmdGroupShow, cmdGroupDelete, handleGroupCommand };
