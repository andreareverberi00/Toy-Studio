export class AudioEngine {
    private static instance: AudioEngine;
    public context: AudioContext;
    public masterGain: GainNode;
    private lookahead: number = 25.0; // ms
    private scheduleAheadTime: number = 0.1; // s
    private nextNoteTime: number = 0.0;
    private isPlaying: boolean = false;
    private timerID: number | null = null;
    private bpm: number = 128;
    private currentStep: number = 0;
    private totalSteps: number = 64; // 4 bars * 16 steps
    private callback: ((step: number, time: number) => void) | null = null;

    private constructor() {
        this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.context.destination);
        this.masterGain.gain.value = 0.8;
    }

    public static getInstance(): AudioEngine {
        if (!AudioEngine.instance) {
            AudioEngine.instance = new AudioEngine();
        }
        return AudioEngine.instance;
    }

    public setBpm(bpm: number) {
        this.bpm = bpm;
    }

    public setScheduleCallback(cb: (step: number, time: number) => void) {
        this.callback = cb;
    }

    public start() {
        if (this.isPlaying) return;
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
        this.isPlaying = true;
        this.currentStep = 0;
        this.nextNoteTime = this.context.currentTime;
        this.scheduler();
    }

    public stop() {
        this.isPlaying = false;
        if (this.timerID !== null) {
            window.clearTimeout(this.timerID);
            this.timerID = null;
        }
    }

    private nextNote() {
        const secondsPerBeat = 60.0 / this.bpm;
        // 16th notes = 0.25 of a beat
        this.nextNoteTime += 0.25 * secondsPerBeat;
        this.currentStep++;
        if (this.currentStep === this.totalSteps) {
            this.currentStep = 0;
        }
    }

    private scheduler() {
        while (this.nextNoteTime < this.context.currentTime + this.scheduleAheadTime) {
            this.scheduleNote(this.currentStep, this.nextNoteTime);
            this.nextNote();
        }
        this.timerID = window.setTimeout(() => this.scheduler(), this.lookahead);
    }

    private scheduleNote(step: number, time: number) {
        if (this.callback) {
            this.callback(step, time);
        }
    }
}

export const audioEngine = AudioEngine.getInstance();


