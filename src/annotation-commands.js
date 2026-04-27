const { addAnnotation, removeAnnotation, listAnnotations, getAnnotationsForTarget, searchAnnotations } = require('./annotation');

function cmdAnnotationAdd(args) {
  const [target, note, ...tagArgs] = args;
  if (!target || !note) {
    console.log('Usage: tabforge annotation add <target> <note> [tag1,tag2,...]');
    return;
  }
  const tags = tagArgs.length ? tagArgs[0].split(',') : [];
  const ann = addAnnotation(target, note, tags);
  console.log(`Annotation added: ${ann.id} -> ${target}`);
}

function cmdAnnotationRemove(args) {
  const [id] = args;
  if (!id) { console.log('Usage: tabforge annotation remove <id>'); return; }
  try {
    removeAnnotation(id);
    console.log(`Annotation '${id}' removed.`);
  } catch (e) {
    console.log(e.message);
  }
}

function cmdAnnotationList(args) {
  const [target] = args;
  const items = target ? getAnnotationsForTarget(target) : listAnnotations();
  if (!items.length) { console.log('No annotations found.'); return; }
  items.forEach(a => {
    const tags = a.tags && a.tags.length ? ` [${a.tags.join(', ')}]` : '';
    console.log(`${a.id} | ${a.target}${tags}: ${a.note}`);
  });
}

function cmdAnnotationSearch(args) {
  const [query] = args;
  if (!query) { console.log('Usage: tabforge annotation search <query>'); return; }
  const results = searchAnnotations(query);
  if (!results.length) { console.log('No matching annotations.'); return; }
  results.forEach(a => console.log(`${a.id} | ${a.target}: ${a.note}`));
}

function handleAnnotationCommand(sub, args) {
  switch (sub) {
    case 'add':    return cmdAnnotationAdd(args);
    case 'remove': return cmdAnnotationRemove(args);
    case 'list':   return cmdAnnotationList(args);
    case 'search': return cmdAnnotationSearch(args);
    default:
      console.log('Unknown annotation command. Use: add, remove, list, search');
  }
}

module.exports = { cmdAnnotationAdd, cmdAnnotationRemove, cmdAnnotationList, cmdAnnotationSearch, handleAnnotationCommand };
