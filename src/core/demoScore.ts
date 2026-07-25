import type { ScoreDocument } from './types.js';

export const demoScore: ScoreDocument = {
  id: 'demo-ode-to-joy-fragment',
  title: 'Ode to Joy Fragment',
  composer: 'L. v. Beethoven',
  tempoBpm: 108,
  timeSignature: { beats: 4, beatType: 4 },
  source: { kind: 'demo' },
  notes: [
    { id: 'n1', pitch: { step: 'E', octave: 4 }, startBeat: 0, durationBeats: 1, velocity: 76, confidence: 0.96 },
    { id: 'n2', pitch: { step: 'E', octave: 4 }, startBeat: 1, durationBeats: 1, velocity: 74, confidence: 0.94 },
    { id: 'n3', pitch: { step: 'F', octave: 4 }, startBeat: 2, durationBeats: 1, velocity: 78, confidence: 0.62 },
    { id: 'n4', pitch: { step: 'G', octave: 4 }, startBeat: 3, durationBeats: 1, velocity: 82, confidence: 0.92 },
    { id: 'n5', pitch: { step: 'G', octave: 4 }, startBeat: 4, durationBeats: 1, velocity: 84, confidence: 0.93 },
    { id: 'n6', pitch: { step: 'F', octave: 4 }, startBeat: 5, durationBeats: 1, velocity: 78, confidence: 0.88 },
    { id: 'n7', pitch: { step: 'E', octave: 4 }, startBeat: 6, durationBeats: 1, velocity: 76, confidence: 0.91 },
    { id: 'n8', pitch: { step: 'D', octave: 4 }, startBeat: 7, durationBeats: 1, velocity: 72, confidence: 0.86 }
  ]
};
