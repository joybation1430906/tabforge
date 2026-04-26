// dependency-commands.js — CLI commands for managing session dependencies

const {
  addDependency,
  removeDependency,
  loadDependencies,
  saveDependencies,
  resolveDependencies,
  checkCircular,
  getDependencyGraph,
  ensureDepsDir,
} = require('./dependency');

async function cmdDepAdd(args) {
  const [name, dep] = args;
  if (!name || !dep) {
    console.log('Usage: tabforge dep add <session> <dependency>');
    return;
  }
  await ensureDepsDir();
  const circular = await checkCircular(name, dep);
  if (circular) {
    console.error(`Error: adding '${dep}' would create a circular dependency`);
    return;
  }
  await addDependency(name, dep);
  console.log(`Added dependency '${dep}' to '${name}'`);
}

async function cmdDepRemove(args) {
  const [name, dep] = args;
  if (!name || !dep) {
    console.log('Usage: tabforge dep remove <session> <dependency>');
    return;
  }
  await removeDependency(name, dep);
  console.log(`Removed dependency '${dep}' from '${name}'`);
}

async function cmdDepList(args) {
  const [name] = args;
  if (!name) {
    console.log('Usage: tabforge dep list <session>');
    return;
  }
  await ensureDepsDir();
  const deps = await loadDependencies(name);
  if (!deps || deps.length === 0) {
    console.log(`No dependencies for '${name}'`);
    return;
  }
  console.log(`Dependencies for '${name}':\n  - ${deps.join('\n  - ')}`);
}

async function cmdDepResolve(args) {
  const [name] = args;
  if (!name) {
    console.log('Usage: tabforge dep resolve <session>');
    return;
  }
  await ensureDepsDir();
  const order = await resolveDependencies(name);
  if (!order || order.length === 0) {
    console.log(`No dependencies to resolve for '${name}'`);
    return;
  }
  console.log(`Resolved launch order for '${name}':\n  ${order.join(' -> ')}`);
}

async function cmdDepGraph(args) {
  const [name] = args;
  if (!name) {
    console.log('Usage: tabforge dep graph <session>');
    return;
  }
  await ensureDepsDir();
  const graph = await getDependencyGraph(name);
  if (!graph || Object.keys(graph).length === 0) {
    console.log(`No dependency graph for '${name}'`);
    return;
  }
  console.log(`Dependency graph for '${name}':`);
  for (const [node, deps] of Object.entries(graph)) {
    if (deps.length > 0) {
      console.log(`  ${node} -> ${deps.join(', ')}`);
    } else {
      console.log(`  ${node} (no deps)`);
    }
  }
}

async function handleDepCommand(sub, args) {
  switch (sub) {
    case 'add':     return cmdDepAdd(args);
    case 'remove':  return cmdDepRemove(args);
    case 'list':    return cmdDepList(args);
    case 'resolve': return cmdDepResolve(args);
    case 'graph':   return cmdDepGraph(args);
    default:
      console.log('Usage: tabforge dep <add|remove|list|resolve|graph> [args]');
  }
}

module.exports = {
  cmdDepAdd,
  cmdDepRemove,
  cmdDepList,
  cmdDepResolve,
  cmdDepGraph,
  handleDepCommand,
};
