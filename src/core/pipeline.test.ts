import assert from 'node:assert/strict';
import test from 'node:test';
import { demoScore } from './demoScore.js';
import { analyzeRecognition, buildProductionProject, humanizePerformance } from './pipeline.js';

test('flags low-confidence recognition results for easy correction', () => {
  const issues = analyzeRecognition(demoScore);
  assert.equal(issues.length, 1);
  assert.equal(issues[0]?.noteId, 'n3');
});

test('humanized playback keeps musical timing data separate from source score', () => {
  const performance = humanizePerformance(demoScore);
  assert.equal(performance.length, demoScore.notes.length);
  assert.notEqual(performance[1]?.humanizedStartBeat, demoScore.notes[1]?.startBeat);
  assert.ok(performance.every((event) => event.velocity >= 1 && event.velocity <= 127));
});

test('production project includes arrangement and publishable export targets', () => {
  const project = buildProductionProject(demoScore);
  assert.deepEqual(project.arrangement.map((track) => track.role), ['melody', 'bass', 'harmony']);
  assert.ok(project.exportTargets.includes('mp3'));
  assert.ok(project.exportTargets.includes('share-link'));
});
