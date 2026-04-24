#!/usr/bin/env node

/**
 * tabforge - main entry point
 * Wires together CLI parsing with all command handlers
 */

const { parseArgs, printUsage } = require('./cli');
const { parseSessionConfig } = require('./parser');
const { openTab } = require('./launcher');
const { cmdSave, cmdList, cmdDelete, cmdShow } = require('./session-commands');
const { cmdHistory, cmdHistoryClear, cmdHistoryDelete } = require('./history-commands');
const { handleProfileCommand } = require('./profile-integration');
const { handleBookmarkCommand } = require('./bookmark-commands');
const { handleGroupIntegration } = require('./group-integration');
const { handleCollectionLaunch } = require('./collection-integration');
const { handleQueueIntegration } = require('./queue-integration');
const { handleFlowIntegration } = require('./flow-integration');
const { handleHotkeyIntegration } = require('./hotkey-integration');
const { handleHookIntegration } = require('./hook-integration');
const { handleDiffCommand } = require('./diff-commands');
const { handleFilterCommand } = require('./filter-commands');
const { handleSnippetCommand } = require('./snippet-commands');
const { handleAliasCommand } = require('./alias-commands');
const { handleThemeCommand } = require('./theme-commands');
const { handleSyncCommand } = require('./sync-commands');
const { handleShortcutCommand } = require('./shortcut-commands');
const { handleEnvCommand } = require('./env-commands');
const { handleBadgeCommand } = require('./badge-commands');
const { cmdSnapshotSave, cmdSnapshotList, cmdSnapshotShow, cmdSnapshotDelete } = require('./snapshot-commands');
const { cmdMacroSave, cmdMacroRun, cmdMacroList, cmdMacroShow, cmdMacroDelete } = require('./macro-commands');
const { cmdBatchCreate, cmdBatchAdd, cmdBatchRemove, cmdBatchList, cmdBatchShow } = require('./batch-commands');
const { cmdHookAdd, cmdHookRemove, cmdHookList, cmdHookShow, cmdHookToggle } = require('./hook-commands');
const { handleNoteCommand } = require('./note-commands');
const { handleTagCommand } = require('./tag-commands') || {};
const path = require('path');
const fs = require('fs');

async function main() {
  const { command, subcommand, args, flags } = parseArgs(process.argv.slice(2));

  if (!command || flags.help || flags.h) {
    printUsage();
    process.exit(0);
  }

  try {
    switch (command) {
      case 'launch': {
        const file = args[0];
        if (!file) { console.error('Error: no config file specified'); process.exit(1); }
        const config = parseSessionConfig(fs.readFileSync(path.resolve(file), 'utf8'));
        for (const tab of config.tabs) await openTab(tab, flags);
        break;
      }

      case 'session':
        if (subcommand === 'save')   return cmdSave(args, flags);
        if (subcommand === 'list')   return cmdList(args, flags);
        if (subcommand === 'delete') return cmdDelete(args, flags);
        if (subcommand === 'show')   return cmdShow(args, flags);
        console.error(`Unknown session subcommand: ${subcommand}`); process.exit(1);
        break;

      case 'history':
        if (!subcommand || subcommand === 'list') return cmdHistory(args, flags);
        if (subcommand === 'clear')  return cmdHistoryClear(args, flags);
        if (subcommand === 'delete') return cmdHistoryDelete(args, flags);
        break;

      case 'profile':    return handleProfileCommand(subcommand, args, flags);
      case 'bookmark':   return handleBookmarkCommand(subcommand, args, flags);
      case 'group':      return handleGroupIntegration(subcommand, args, flags);
      case 'collection': return handleCollectionLaunch(subcommand, args, flags);
      case 'queue':      return handleQueueIntegration(subcommand, args, flags);
      case 'flow':       return handleFlowIntegration(subcommand, args, flags);
      case 'hotkey':     return handleHotkeyIntegration(subcommand, args, flags);
      case 'hook':       return handleHookIntegration(subcommand, args, flags);
      case 'diff':       return handleDiffCommand(subcommand, args, flags);
      case 'filter':     return handleFilterCommand(subcommand, args, flags);
      case 'snippet':    return handleSnippetCommand(subcommand, args, flags);
      case 'alias':      return handleAliasCommand(subcommand, args, flags);
      case 'theme':      return handleThemeCommand(subcommand, args, flags);
      case 'sync':       return handleSyncCommand(subcommand, args, flags);
      case 'shortcut':   return handleShortcutCommand(subcommand, args, flags);
      case 'env':        return handleEnvCommand(subcommand, args, flags);
      case 'badge':      return handleBadgeCommand(subcommand, args, flags);
      case 'note':       return handleNoteCommand(subcommand, args, flags);

      case 'snapshot':
        if (subcommand === 'save')   return cmdSnapshotSave(args, flags);
        if (subcommand === 'list')   return cmdSnapshotList(args, flags);
        if (subcommand === 'show')   return cmdSnapshotShow(args, flags);
        if (subcommand === 'delete') return cmdSnapshotDelete(args, flags);
        break;

      case 'macro':
        if (subcommand === 'save')   return cmdMacroSave(args, flags);
        if (subcommand === 'run')    return cmdMacroRun(args, flags);
        if (subcommand === 'list')   return cmdMacroList(args, flags);
        if (subcommand === 'show')   return cmdMacroShow(args, flags);
        if (subcommand === 'delete') return cmdMacroDelete(args, flags);
        break;

      case 'batch':
        if (subcommand === 'create') return cmdBatchCreate(args, flags);
        if (subcommand === 'add')    return cmdBatchAdd(args, flags);
        if (subcommand === 'remove') return cmdBatchRemove(args, flags);
        if (subcommand === 'list')   return cmdBatchList(args, flags);
        if (subcommand === 'show')   return cmdBatchShow(args, flags);
        break;

      default:
        console.error(`Unknown command: ${command}`);
        printUsage();
        process.exit(1);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    if (flags.verbose || flags.v) console.error(err.stack);
    process.exit(1);
  }
}

main();
