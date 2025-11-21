export abstract class Instrument {
    abstract play(note: string, time: number, duration?: number, context?: BaseAudioContext): void;
}

export class SynthInstrument extends Instrument {
    private type: OscillatorType;

    constructor(type: OscillatorType = 'sine') {
        super();
        this.type = type;
    }

    play(note: string, time: number, duration: number = 0.1, context?: BaseAudioContext) {
        if (!context) return;
        const ctx = context;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = this.type;
        osc.frequency.value = this.noteToFreq(note);

        osc.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

        osc.start(time);
        osc.stop(time + duration);
    }

    private noteToFreq(note: string): number {
        const notes: Record<string, number> = {
            'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
        };
        return notes[note] || 440;
    }
}

export class DrumInstrument extends Instrument {
    private type: 'kick' | 'snare' | 'hihat';

    constructor(type: 'kick' | 'snare' | 'hihat') {
        super();
        this.type = type;
    }

    play(_note: string, time: number, _duration?: number, context?: BaseAudioContext) {
        if (!context) return;
        const ctx = context;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (this.type === 'kick') {
            osc.frequency.setValueAtTime(150, time);
            osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
            gain.gain.setValueAtTime(1, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
            osc.start(time);
            osc.stop(time + 0.5);
        } else if (this.type === 'snare') {
            const bufferSize = ctx.sampleRate * 0.2;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const noiseGain = ctx.createGain();
            noise.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            noiseGain.gain.setValueAtTime(0.5, time);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
            noise.start(time);
        } else if (this.type === 'hihat') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, time);
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
            osc.start(time);
            osc.stop(time + 0.05);
        }
    }
}
