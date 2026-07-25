export type PitchStep = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

export interface Pitch {
  step: PitchStep;
  octave: number;
  alter?: -2 | -1 | 0 | 1 | 2;
}

export interface NoteEvent {
  id: string;
  pitch: Pitch;
  startBeat: number;
  durationBeats: number;
  velocity: number;
  staff?: number;
  confidence: number;
}

export interface ScoreDocument {
  id: string;
  title: string;
  composer?: string;
  tempoBpm: number;
  timeSignature: { beats: number; beatType: number };
  notes: NoteEvent[];
  source: {
    kind: 'image' | 'musicxml' | 'manual' | 'demo';
    uri?: string;
  };
}

export interface RecognitionIssue {
  noteId?: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  suggestedFix?: string;
}

export interface PerformanceEvent extends NoteEvent {
  humanizedStartBeat: number;
  humanizedDurationBeats: number;
  expression: {
    timingOffsetMs: number;
    velocityDelta: number;
    articulation: 'legato' | 'tenuto' | 'staccato';
  };
}

export interface ArrangementTrack {
  id: string;
  role: 'melody' | 'bass' | 'harmony' | 'drums';
  instrument: string;
  events: PerformanceEvent[];
}

export interface ProductionProject {
  score: ScoreDocument;
  issues: RecognitionIssue[];
  performance: PerformanceEvent[];
  arrangement: ArrangementTrack[];
  exportTargets: Array<'midi' | 'musicxml' | 'wav' | 'mp3' | 'share-link'>;
}
