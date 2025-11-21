import React from 'react';
import { Play, Square, Download, Sliders, FilePlus, HelpCircle } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { cn } from '../utils/cn';

export const TransportBar: React.FC = () => {
    const {
        isPlaying,
        togglePlayback,
        project,
        setBpm,
        setNumBars,
        resetProject,
        isMixerOpen,
        setMixerOpen,
        exportAudio,
        setHasSeenOnboarding
    } = useProjectStore();

    return (
        <div className="h-16 border-b border-zinc-800 bg-zinc-900 flex items-center px-6 gap-6 shadow-md z-10">
            <div className="flex items-center gap-2 mr-4">
                <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center font-bold text-black">
                    FL
                </div>
                <span className="font-bold text-lg tracking-tight text-zinc-100">Toy Studio</span>
                <button
                    onClick={() => setHasSeenOnboarding(false)}
                    className="ml-2 text-zinc-600 hover:text-zinc-400 transition-colors"
                    title="Show Onboarding"
                >
                    <HelpCircle size={16} />
                </button>
            </div>

            <div className="flex items-center gap-2 bg-zinc-800 p-1 rounded-lg">
                <button
                    onClick={togglePlayback}
                    className={cn(
                        "p-2 rounded-md transition-all relative overflow-hidden",
                        isPlaying
                            ? "bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.6)] scale-105"
                            : "hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100"
                    )}
                >
                    {isPlaying && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                    <Play size={20} fill={isPlaying ? "currentColor" : "none"} className="relative z-10" />
                </button>
                <button
                    onClick={() => isPlaying && togglePlayback()}
                    className="p-2 rounded-md hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-all"
                >
                    <Square size={20} fill="currentColor" />
                </button>
            </div>

            <div className="flex items-center gap-4 bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700">
                <div className="flex flex-col items-center border-r border-zinc-700 pr-4 mr-2">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">BPM</span>
                    <input
                        type="number"
                        value={project.bpm}
                        onChange={(e) => setBpm(Number(e.target.value))}
                        className="w-12 bg-transparent text-center font-mono text-orange-400 font-bold focus:outline-none"
                    />
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">BARS</span>
                    <input
                        type="number"
                        min={1}
                        max={8}
                        value={project.numBars}
                        onChange={(e) => setNumBars(Number(e.target.value))}
                        className="w-8 bg-transparent text-center font-mono text-orange-400 font-bold focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setMixerOpen(!isMixerOpen)}
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm mr-2",
                        isMixerOpen ? "bg-zinc-700 text-zinc-100" : "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100"
                    )}
                >
                    <Sliders size={16} />
                    <span>Mixer</span>
                </button>

                <button
                    onClick={resetProject}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors text-sm"
                >
                    <FilePlus size={16} />
                    <span>New</span>
                </button>

                <button
                    onClick={exportAudio}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-medium transition-colors text-sm shadow-lg shadow-orange-900/20"
                >
                    <Download size={16} />
                    <span>Export</span>
                </button>
            </div>
        </div>
    );
};
