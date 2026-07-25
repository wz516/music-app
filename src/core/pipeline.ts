import type { ArrangementTrack, NoteEvent, PerformanceEvent, ProductionProject, RecognitionIssue, ScoreDocument } from './types.js';

const NOTE_ORDER = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

export function analyzeRecognition(score: ScoreDocument): RecognitionIssue[] {
  const issues: RecognitionIssue[] = [];

  if (score.notes.length === 0) {
    issues.push({ severity: 'error', message: '乐谱中没有可播放音符。', suggestedFix: '请重新上传图片，或进入编辑器手动添加音符。' });
  }

  for (const note of score.notes) {
    if (note.confidence < 0.75) {
      issues.push({
        noteId: note.id,
        severity: note.confidence < 0.5 ? 'error' : 'warning',
        message: `音符 ${note.id} 的识别置信度偏低 (${Math.round(note.confidence * 100)}%)。`,
        suggestedFix: '在校对模式中对照原图修改音高、时值或小节位置。'
      });
    }
    if (note.durationBeats <= 0) {
      issues.push({ noteId: note.id, severity: 'error', message: `音符 ${note.id} 的时值无效。`, suggestedFix: '将时值改为大于 0 的拍数。' });
    }
  }

  return issues;
}

export function humanizePerformance(score: ScoreDocument): PerformanceEvent[] {
  return score.notes.map((note, index) => {
    const phrasePosition = index % score.timeSignature.beats;
    const timingOffsetMs = phrasePosition === 0 ? -12 : (index % 2 === 0 ? 8 : -5);
    const velocityDelta = phrasePosition === 0 ? 10 : (index % 3) - 1;
    const articulation = note.durationBeats < 0.75 ? 'staccato' : note.durationBeats > 1.5 ? 'legato' : 'tenuto';

    return {
      ...note,
      humanizedStartBeat: Math.max(0, note.startBeat + timingOffsetMs / 60000 * score.tempoBpm),
      humanizedDurationBeats: articulation === 'staccato' ? note.durationBeats * 0.72 : note.durationBeats * 0.96,
      expression: { timingOffsetMs, velocityDelta, articulation },
      velocity: clamp(note.velocity + velocityDelta, 1, 127)
    };
  });
}

export function createStarterArrangement(score: ScoreDocument, performance: PerformanceEvent[]): ArrangementTrack[] {
  const bassEvents = performance
    .filter((_, index) => index % score.timeSignature.beats === 0)
    .map((note) => ({ ...note, id: `bass-${note.id}`, pitch: transposeDiatonic(note, -14), velocity: 68 }));

  const harmonyEvents = performance
    .filter((_, index) => index % 2 === 0)
    .map((note) => ({ ...note, id: `pad-${note.id}`, pitch: transposeDiatonic(note, -2), velocity: 52, humanizedDurationBeats: note.durationBeats * 1.8 }));

  return [
    { id: 'melody', role: 'melody', instrument: 'expressive-grand-piano', events: performance },
    { id: 'bass', role: 'bass', instrument: 'acoustic-bass', events: bassEvents },
    { id: 'harmony-pad', role: 'harmony', instrument: 'warm-strings', events: harmonyEvents }
  ];
}

export function buildProductionProject(score: ScoreDocument): ProductionProject {
  const issues = analyzeRecognition(score);
  const performance = humanizePerformance(score);
  const arrangement = createStarterArrangement(score, performance);

  return {
    score,
    issues,
    performance,
    arrangement,
    exportTargets: ['midi', 'musicxml', 'wav', 'mp3', 'share-link']
  };
}

function transposeDiatonic(note: NoteEvent, semitoneLikeSteps: number) {
  const current = NOTE_ORDER.indexOf(note.pitch.step);
  const raw = current + semitoneLikeSteps;
  const step = NOTE_ORDER[((raw % NOTE_ORDER.length) + NOTE_ORDER.length) % NOTE_ORDER.length];
  const octave = note.pitch.octave + Math.floor(raw / NOTE_ORDER.length);
  return { ...note.pitch, step, octave };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
