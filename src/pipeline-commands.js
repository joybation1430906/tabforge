const { savePipeline, loadPipeline, listPipelines, deletePipeline, renamePipeline, createPipeline } = require('./pipeline');

function cmdPipelineCreate(args) {
  const [name, ...steps] = args;
  if (!name) return console.log('Usage: pipeline create <name> [step1 step2 ...]');
  const pipeline = createPipeline(name, steps);
  savePipeline(name, pipeline);
  console.log(`Pipeline '${name}' created with ${steps.length} step(s).`);
}

function cmdPipelineAdd(args) {
  const [name, ...newSteps] = args;
  if (!name || newSteps.length === 0) return console.log('Usage: pipeline add <name> <step> [step2 ...]');
  const pipeline = loadPipeline(name);
  if (!pipeline) return console.log(`Pipeline '${name}' not found.`);
  pipeline.steps.push(...newSteps);
  savePipeline(name, pipeline);
  console.log(`Added ${newSteps.length} step(s) to pipeline '${name}'.`);
}

function cmdPipelineList() {
  const names = listPipelines();
  if (names.length === 0) return console.log('No pipelines saved.');
  names.forEach(n => console.log(`  - ${n}`));
}

function cmdPipelineShow(args) {
  const [name] = args;
  if (!name) return console.log('Usage: pipeline show <name>');
  const pipeline = loadPipeline(name);
  if (!pipeline) return console.log(`Pipeline '${name}' not found.`);
  console.log(`Pipeline: ${pipeline.name}`);
  console.log(`Created: ${pipeline.createdAt}`);
  console.log('Steps:');
  pipeline.steps.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
}

function cmdPipelineDelete(args) {
  const [name] = args;
  if (!name) return console.log('Usage: pipeline delete <name>');
  const ok = deletePipeline(name);
  console.log(ok ? `Pipeline '${name}' deleted.` : `Pipeline '${name}' not found.`);
}

function cmdPipelineRename(args) {
  const [oldName, newName] = args;
  if (!oldName || !newName) return console.log('Usage: pipeline rename <old> <new>');
  const ok = renamePipeline(oldName, newName);
  console.log(ok ? `Renamed '${oldName}' to '${newName}'.` : `Pipeline '${oldName}' not found.`);
}

function handlePipelineCommand(sub, args) {
  switch (sub) {
    case 'create': return cmdPipelineCreate(args);
    case 'add': return cmdPipelineAdd(args);
    case 'list': return cmdPipelineList();
    case 'show': return cmdPipelineShow(args);
    case 'delete': return cmdPipelineDelete(args);
    case 'rename': return cmdPipelineRename(args);
    default: console.log('Unknown pipeline subcommand: ' + sub);
  }
}

module.exports = {
  cmdPipelineCreate,
  cmdPipelineAdd,
  cmdPipelineList,
  cmdPipelineShow,
  cmdPipelineDelete,
  cmdPipelineRename,
  handlePipelineCommand
};
