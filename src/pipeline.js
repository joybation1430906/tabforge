const fs = require('fs');
const path = require('path');

const PIPELINES_DIR = path.join(process.env.HOME || '.', '.tabforge', 'pipelines');

function ensurePipelinesDir() {
  if (!fs.existsSync(PIPELINES_DIR)) fs.mkdirSync(PIPELINES_DIR, { recursive: true });
}

function getPipelinePath(name) {
  return path.join(PIPELINES_DIR, `${name}.json`);
}

function savePipeline(name, pipeline) {
  ensurePipelinesDir();
  fs.writeFileSync(getPipelinePath(name), JSON.stringify(pipeline, null, 2));
}

function loadPipeline(name) {
  const p = getPipelinePath(name);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function listPipelines() {
  ensurePipelinesDir();
  return fs.readdirSync(PIPELINES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deletePipeline(name) {
  const p = getPipelinePath(name);
  if (!fs.existsSync(p)) return false;
  fs.unlinkSync(p);
  return true;
}

function renamePipeline(oldName, newName) {
  const pipeline = loadPipeline(oldName);
  if (!pipeline) return false;
  savePipeline(newName, { ...pipeline, name: newName });
  deletePipeline(oldName);
  return true;
}

function createPipeline(name, steps = []) {
  return { name, steps, createdAt: new Date().toISOString() };
}

module.exports = {
  ensurePipelinesDir,
  getPipelinePath,
  savePipeline,
  loadPipeline,
  listPipelines,
  deletePipeline,
  renamePipeline,
  createPipeline
};
