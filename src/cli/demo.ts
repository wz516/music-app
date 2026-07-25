import { demoScore } from '../core/demoScore.js';
import { buildProductionProject } from '../core/pipeline.js';

const project = buildProductionProject(demoScore);

console.log(JSON.stringify({
  title: project.score.title,
  recognitionIssues: project.issues,
  tracks: project.arrangement.map((track) => ({ id: track.id, role: track.role, instrument: track.instrument, events: track.events.length })),
  exportTargets: project.exportTargets
}, null, 2));
