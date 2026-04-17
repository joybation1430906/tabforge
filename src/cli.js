#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parseSessionConfig, validateConfig } = require('./parser');
const { launchSession } = require('./launcher');

const args = process.argv.slice(2);

function printUsage() {
  console.log('Usage: tabforge <session.yaml> [--browser=chrome] [--delay=200]');
  console.log('\nOptions:');
  console.log('  --browser=<name>   Browser to use (chrome, firefox, safari)');
  console.log('  --delay=<ms>       Delay between opening tabs (default: 200)');
  console.log('  --dry-run          Print tabs without opening them');
}

function parseArgs(args) {
  const opts = { browser: 'default', delay: 200, dryRun: false };
  const positional = [];

  for (const arg of args) {
    if (arg.startsWith('--browser=')) opts.browser = arg.split('=')[1];
    else if (arg.startsWith('--delay=')) opts.delay = parseInt(arg.split('=')[1], 10);
    else if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--help' || arg === '-h') opts.help = true;
    else positional.push(arg);
  }

  return { opts, positional };
}

async function main() {
  const { opts, positional } = parseArgs(args);

  if (opts.help || positional.length === 0) {
    printUsage();
    process.exit(0);
  }

  const filePath = path.resolve(positional[0]);

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found — ${filePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const session = parseSessionConfig(raw);
  const errors = validateConfig(session);

  if (errors.length > 0) {
    console.error('Invalid session config:');
    errors.forEach((e) => console.error(` - ${e}`));
    process.exit(1);
  }

  console.log(`Session: ${session.name} (${session.tabs.length} tabs)`);

  if (opts.dryRun) {
    session.tabs.forEach((tab) => console.log(` • ${tab.url}`));
    return;
  }

  const results = await launchSession(session, opts);
  console.log(`Opened: ${results.opened.length}, Failed: ${results.failed.length}`);
  results.failed.forEach((f) => console.error(` ✗ ${f.url}: ${f.error}`));
}

main().catch((err) => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
