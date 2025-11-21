import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AudioEngine } from '../audio/AudioEngine';
import { AudioExporter } from '../audio/AudioExporter';
import { DrumInstrument, SynthInstrument } from '../audio/Instruments';
import type { Project, Track, Pattern } from '../types';

const DEFAULT_BPM = 128;
const STEPS_PER_BAR = 16;
const DEFAULT_NUM_BARS = 4;

interface ProjectState {
    project: Project;
    isPlaying: boolean;
    currentStep: number;
    currentBar: number;
    activePianoRollTrackId: string | null;
    isMixerOpen: boolean;
    hasSeenOnboarding: boolean;
    instruments: Record<string, DrumInstrument | SynthInstrument>;

    // Actions
    setMixerOpen: (isOpen: boolean) => void;
    setActivePianoRollTrack: (id: string | null) => void;
    setBpm: (bpm: number) => void;
    setNumBars: (bars: number) => void;
    togglePlayback: () => void;
    setVolume: (trackId: string, volume: number) => void;
    toggleMute: (trackId: string) => void;
    toggleSolo: (trackId: string) => void;
    toggleStep: (trackId: string, stepIndex: number, note?: string) => void;
    setCurrentBar: (barIndex: number) => void;
    resetProject: () => void;
    initAudio: () => void;
    exportAudio: () => Promise<void>;
    setHasSeenOnboarding: (seen: boolean) => void;
}

const createDefaultPatterns = (tracks: Track[], numBars: number): Record<string, Pattern[]> => {
    const patterns: Record<string, Pattern[]> = {};
    tracks.forEach(track => {
        patterns[track.id] = Array.from({ length: numBars }).map((_, barIndex) => ({
            id: `${track.id}-pattern-${barIndex}`,
            trackId: track.id,
            steps: {},
            length: STEPS_PER_BAR
        }));
    });
    return patterns;
};

const defaultTracks: Track[] = [
    { id: 'kick', name: 'Kick', type: 'drum', subtype: 'kick', volume: 0.8, mute: false, solo: false, color: 'bg-red-500' },
    { id: 'snare', name: 'Snare', type: 'drum', subtype: 'snare', volume: 0.7, mute: false, solo: false, color: 'bg-green-500' },
    { id: 'hat', name: 'Hi-Hat', type: 'drum', subtype: 'hihat', volume: 0.6, mute: false, solo: false, color: 'bg-yellow-500' },
    { id: 'bass', name: 'Bass', type: 'synth', subtype: 'square', volume: 0.6, mute: false, solo: false, color: 'bg-blue-500' },
    { id: 'melody', name: 'Melody', type: 'synth', subtype: 'sawtooth', volume: 0.5, mute: false, solo: false, color: 'bg-purple-500' },
];

export const useProjectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
            project: {
                name: 'Untitled Project',
                bpm: DEFAULT_BPM,
                numBars: DEFAULT_NUM_BARS,
                tracks: defaultTracks,
                patterns: createDefaultPatterns(defaultTracks, DEFAULT_NUM_BARS),
            },
            isPlaying: false,
            currentStep: 0,
            currentBar: 0,
            activePianoRollTrackId: null,
            isMixerOpen: false,
            hasSeenOnboarding: false,
            instruments: {},

            initAudio: () => {
                const engine = AudioEngine.getInstance();

                // Initialize instruments
                const insts: Record<string, DrumInstrument | SynthInstrument> = {};
                get().project.tracks.forEach(track => {
                    if (track.type === 'drum') {
                        insts[track.id] = new DrumInstrument(track.subtype as any);
                    } else {
                        insts[track.id] = new SynthInstrument(track.subtype as any);
                    }
                });
                set({ instruments: insts });

                engine.setScheduleCallback((step: number, time: number) => {
                    const state = get();
                    const totalSteps = STEPS_PER_BAR * state.project.numBars;
                    const currentGlobalStep = step % totalSteps;
                    const currentBar = Math.floor(currentGlobalStep / STEPS_PER_BAR);
                    const stepInBar = currentGlobalStep % STEPS_PER_BAR;

                    // Update UI step
                    set({ currentStep: stepInBar, currentBar: currentBar });

                    // Play notes
                    state.project.tracks.forEach(track => {
                        if (track.mute) return;
                        if (state.project.tracks.some(t => t.solo) && !track.solo) return;

                        const pattern = state.project.patterns[track.id][currentBar];
                        const patternStep = pattern.steps[stepInBar];

                        if (patternStep?.active) {
                            const instrument = state.instruments[track.id];
                            if (instrument) {
                                instrument.play(patternStep.note || 'C4', time, track.volume, engine.context);
                            }
                        }
                    });
                });
            },

            setMixerOpen: (isOpen) => set({ isMixerOpen: isOpen }),
            setActivePianoRollTrack: (id) => set({ activePianoRollTrackId: id }),

            setBpm: (bpm) => {
                set((state) => ({ project: { ...state.project, bpm } }));
                AudioEngine.getInstance().setBpm(bpm);
            },

            setNumBars: (numBars) => {
                if (numBars < 1 || numBars > 8) return; // Limit to 1-8 bars for now
                set((state) => {
                    const patterns = { ...state.project.patterns };

                    // Resize patterns for each track
                    state.project.tracks.forEach(track => {
                        const trackPatterns = [...patterns[track.id]];
                        if (numBars > trackPatterns.length) {
                            // Add new bars
                            for (let i = trackPatterns.length; i < numBars; i++) {
                                trackPatterns.push({
                                    id: `${track.id}-pattern-${i}`,
                                    trackId: track.id,
                                    steps: {},
                                    length: STEPS_PER_BAR
                                });
                            }
                        } else if (numBars < trackPatterns.length) {
                            // Remove bars
                            trackPatterns.length = numBars;
                        }
                        patterns[track.id] = trackPatterns;
                    });

                    return {
                        project: { ...state.project, numBars, patterns }
                    };
                });
            },

            togglePlayback: () => {
                const isPlaying = !get().isPlaying;
                set({ isPlaying });
                if (isPlaying) {
                    AudioEngine.getInstance().start();
                } else {
                    AudioEngine.getInstance().stop();
                    set({ currentStep: 0, currentBar: 0 });
                }
            },

            setVolume: (trackId, volume) => {
                set((state) => ({
                    project: {
                        ...state.project,
                        tracks: state.project.tracks.map(t =>
                            t.id === trackId ? { ...t, volume } : t
                        )
                    }
                }));
            },

            toggleMute: (trackId) => {
                set((state) => ({
                    project: {
                        ...state.project,
                        tracks: state.project.tracks.map(t =>
                            t.id === trackId ? { ...t, mute: !t.mute } : t
                        )
                    }
                }));
            },

            toggleSolo: (trackId) => {
                set((state) => ({
                    project: {
                        ...state.project,
                        tracks: state.project.tracks.map(t =>
                            t.id === trackId ? { ...t, solo: !t.solo } : t
                        )
                    }
                }));
            },

            toggleStep: (trackId, stepIndex, note) => {
                set((state) => {
                    const currentBar = state.currentBar;
                    const patterns = { ...state.project.patterns };
                    const trackPatterns = [...patterns[trackId]];
                    const currentPattern = { ...trackPatterns[currentBar] };
                    const steps = { ...currentPattern.steps };

                    if (steps[stepIndex]?.active && steps[stepIndex]?.note === (note || steps[stepIndex].note)) {
                        delete steps[stepIndex];
                    } else {
                        steps[stepIndex] = { active: true, note };

                        // Play preview sound
                        const instrument = state.instruments[trackId];
                        const track = state.project.tracks.find(t => t.id === trackId);
                        if (instrument && track && !track.mute) {
                            const engine = AudioEngine.getInstance();
                            // Use a slightly higher volume for preview or just track volume
                            instrument.play(note || 'C4', engine.context.currentTime, track.volume, engine.context);
                        }
                    }

                    currentPattern.steps = steps;
                    trackPatterns[currentBar] = currentPattern;
                    patterns[trackId] = trackPatterns;

                    return {
                        project: { ...state.project, patterns }
                    };
                });
            },

            setCurrentBar: (barIndex) => set({ currentBar: barIndex }),

            resetProject: () => {
                AudioEngine.getInstance().stop();
                set({
                    project: {
                        name: 'New Project',
                        bpm: DEFAULT_BPM,
                        numBars: DEFAULT_NUM_BARS,
                        tracks: defaultTracks,
                        patterns: createDefaultPatterns(defaultTracks, DEFAULT_NUM_BARS),
                    },
                    isPlaying: false,
                    currentStep: 0,
                    currentBar: 0
                });
            },

            exportAudio: async () => {
                const project = get().project;
                const blob = await AudioExporter.exportProject(project);
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${project.name.replace(/\s+/g, '_')}.wav`;
                a.click();
                URL.revokeObjectURL(url);
            },

            setHasSeenOnboarding: (seen: boolean) => set({ hasSeenOnboarding: seen })
        }),
        {
            name: 'fl-toy-storage',
            partialize: (state) => ({ project: state.project, hasSeenOnboarding: state.hasSeenOnboarding }),
        }
    )
);
