import { DrumInstrument, SynthInstrument } from './Instruments';
import type { Project } from '../types';

export class AudioExporter {
    public static async exportProject(project: Project): Promise<Blob> {
        const OfflineContext = (window as any).OfflineAudioContext || (window as any).webkitOfflineAudioContext;

        // Calculate total duration
        // 4 bars * 16 steps per bar = 64 steps
        // BPM = beats per minute. 1 beat = 4 steps (16th notes).
        // Steps per minute = BPM * 4.
        // Seconds per step = 60 / (BPM * 4).
        // Total seconds = 64 * (60 / (BPM * 4)) = 16 * (60 / BPM).

        const totalSteps = 64; // 4 bars
        const secondsPerStep = 60 / (project.bpm * 4);
        const totalSeconds = totalSteps * secondsPerStep;

        const sampleRate = 44100;
        const offlineCtx = new OfflineContext(2, Math.ceil(sampleRate * totalSeconds), sampleRate);

        // Instantiate instruments for offline context
        const instruments: Record<string, DrumInstrument | SynthInstrument> = {};
        project.tracks.forEach(track => {
            if (track.type === 'drum') {
                instruments[track.id] = new DrumInstrument(track.subtype as any);
            } else {
                instruments[track.id] = new SynthInstrument(track.subtype as any);
            }
        });

        // Schedule notes
        project.tracks.forEach(track => {
            if (track.mute) return;
            // Solo logic is tricky here if we don't have the full state, but let's assume we export what is audible.
            // If any track is soloed, only export soloed tracks.
            const anySolo = project.tracks.some(t => t.solo);
            if (anySolo && !track.solo) return;

            const trackPatterns = project.patterns[track.id];

            // Iterate through all bars (0-3)
            trackPatterns.forEach((pattern, barIndex) => {
                Object.entries(pattern.steps).forEach(([stepStr, step]) => {
                    const stepIndex = Number(stepStr);
                    if (step.active) {
                        const globalStepIndex = (barIndex * 16) + stepIndex;
                        const time = globalStepIndex * secondsPerStep;

                        const instrument = instruments[track.id];
                        if (instrument) {
                            // Note: Instrument.play connects to destination.
                            // For offline context, destination is the render target.
                            instrument.play(step.note || 'C4', time, track.volume, offlineCtx);
                        }
                    }
                });
            });
        });

        // Render
        const renderedBuffer = await offlineCtx.startRendering();

        // Convert to WAV
        return AudioExporter.bufferToWav(renderedBuffer);
    }

    private static bufferToWav(buffer: AudioBuffer): Blob {
        const numOfChan = buffer.numberOfChannels;
        const length = buffer.length * numOfChan * 2 + 44;
        const bufferArr = new ArrayBuffer(length);
        const view = new DataView(bufferArr);
        const channels = [];
        let i;
        let sample;
        let offset = 0;
        let pos = 0;

        // write WAVE header
        setUint32(0x46464952); // "RIFF"
        setUint32(length - 8); // file length - 8
        setUint32(0x45564157); // "WAVE"

        setUint32(0x20746d66); // "fmt " chunk
        setUint32(16); // length = 16
        setUint16(1); // PCM (uncompressed)
        setUint16(numOfChan);
        setUint32(buffer.sampleRate);
        setUint32(buffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
        setUint16(numOfChan * 2); // block-align
        setUint16(16); // 16-bit (hardcoded in this function)

        setUint32(0x61746164); // "data" - chunk
        setUint32(length - pos - 4); // chunk length

        // write interleaved data
        for (i = 0; i < buffer.numberOfChannels; i++)
            channels.push(buffer.getChannelData(i));

        while (pos < buffer.length) {
            for (i = 0; i < numOfChan; i++) {
                // interleave channels
                sample = Math.max(-1, Math.min(1, channels[i][pos])); // clamp
                sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
                view.setInt16(44 + offset, sample, true);
                offset += 2;
            }
            pos++;
        }

        return new Blob([bufferArr], { type: "audio/wav" });

        function setUint16(data: any) {
            view.setUint16(pos, data, true);
            pos += 2;
        }

        function setUint32(data: any) {
            view.setUint32(pos, data, true);
            pos += 4;
        }
    }
}
