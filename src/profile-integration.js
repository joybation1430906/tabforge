const { cmdProfileSave, cmdProfileList, cmdProfileShow, cmdProfileDelete } = require('./profile-commands');

function handleProfileCommand(args) {
  const [sub, ...rest] = args;

  switch (sub) {
    case 'save':
      cmdProfileSave(rest[0], rest[1]);
      break;
    case 'list':
      cmdProfileList();
      break;
    case 'show':
      cmdProfileShow(rest[0]);
      break;
    case 'delete':
    case 'rm':
      cmdProfileDelete(rest[0]);
      break;
    default:
      console.error(`Unknown profile subcommand: '${sub}'`);
      console.error('Available: save, list, show, delete');
      process.exit(1);
  }
}

module.exports = { handleProfileCommand };
