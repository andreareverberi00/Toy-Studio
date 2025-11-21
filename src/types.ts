export type InstrumentType = 'drum' | 'synth';

export interface Track {
    id: string;
    name: string;
    type: InstrumentType;
    subtype?: 'kick' | 'snare' | 'hihat' | 'sine' | 'square' | 'sawtooth';
    volume: number;
    mute: boolean;
    solo: boolean;
    color: string;
}

export interface Note {
    note: string; // e.g., "C4"
    duration?: number; // in steps
}

export interface Step {
    active: boolean;
    note?: string;
}

export interface Pattern {
    id: string;
    trackId: string;
    steps: Record<number, Step>; // key is step index (0-15)
    length: number; // usually 16
}

export interface Project {
    name: string;
    bpm: number;
    numBars: number;
    tracks: Track[];
    patterns: Record<string, Pattern[]>; // trackId -> array of Patterns (bars)
}
