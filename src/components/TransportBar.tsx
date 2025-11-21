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
        <div className="h-14 md:h-16 border-b border-zinc-800 bg-zinc-900 flex items-center px-2 sm:px-4 md:px-6 gap-2 sm:gap-4 md:gap-6 shadow-md z-10">
            {/* Logo and Title */}
            <div className="flex items-center gap-1.5 sm:gap-2 mr-1 sm:mr-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-500 rounded-md flex items-center justify-center font-bold text-black text-xs sm:text-sm">
                    FL
                </div>
                <span className="hidden sm:inline font-bold text-base md:text-lg tracking-tight text-zinc-100">Toy Studio</span>
                <button
                    onClick={() => setHasSeenOnboarding(false)}
                    className="ml-1 sm:ml-2 text-zinc-600 hover:text-zinc-400 transition-colors p-1"
                    title="Show Onboarding"
                >
                    <HelpCircle size={14} className="sm:w-4 sm:h-4" />
                </button>
            </div>

            {/* Play/Stop Controls */}
            <div className="flex items-center gap-1 bg-zinc-800 p-1 rounded-lg">
                <button
                    onClick={togglePlayback}
                    className={cn(
                        "p-2.5 sm:p-2 rounded-md transition-all relative overflow-hidden touch-manipulation",
                        isPlaying
                            ? "bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.6)] scale-105"
                            : "hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100"
                    )}
                >
                    {isPlaying && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                    <Play size={18} className="sm:w-5 sm:h-5 relative z-10" fill={isPlaying ? "currentColor" : "none"} />
                </button>
                <button
                    onClick={() => isPlaying && togglePlayback()}
                    className="p-2.5 sm:p-2 rounded-md hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-all touch-manipulation"
                >
                    <Square size={18} className="sm:w-5 sm:h-5" fill="currentColor" />
                </button>
            </div>

            {/* BPM and BARS */}
            <div className="flex items-center gap-2 sm:gap-4 bg-zinc-800 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-zinc-700">
                <div className="flex flex-col items-center border-r border-zinc-700 pr-2 sm:pr-4 mr-1 sm:mr-2">
                    <span className="text-[9px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">BPM</span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setBpm(Math.max(60, project.bpm - 1))}
                            className="w-6 h-6 sm:w-5 sm:h-5 flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300 hover:text-zinc-100 transition-colors touch-manipulation"
                            title="Decrease BPM"
                        >
                            <span className="text-xs font-bold">−</span>
                        </button>
                        <input
                            type="number"
                            value={project.bpm}
                            onChange={(e) => setBpm(Number(e.target.value))}
                            className="w-10 sm:w-12 bg-transparent text-center font-mono text-orange-400 font-bold focus:outline-none text-sm"
                            readOnly
                        />
                        <button
                            onClick={() => setBpm(Math.min(200, project.bpm + 1))}
                            className="w-6 h-6 sm:w-5 sm:h-5 flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300 hover:text-zinc-100 transition-colors touch-manipulation"
                            title="Increase BPM"
                        >
                            <span className="text-xs font-bold">+</span>
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[9px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">BARS</span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setNumBars(Math.max(1, project.numBars - 1))}
                            className="w-6 h-6 sm:w-5 sm:h-5 flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300 hover:text-zinc-100 transition-colors touch-manipulation"
                            title="Decrease Bars"
                        >
                            <span className="text-xs font-bold">−</span>
                        </button>
                        <input
                            type="number"
                            min={1}
                            max={8}
                            value={project.numBars}
                            onChange={(e) => setNumBars(Number(e.target.value))}
                            className="w-7 sm:w-8 bg-transparent text-center font-mono text-orange-400 font-bold focus:outline-none text-sm"
                            readOnly
                        />
                        <button
                            onClick={() => setNumBars(Math.min(8, project.numBars + 1))}
                            className="w-6 h-6 sm:w-5 sm:h-5 flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300 hover:text-zinc-100 transition-colors touch-manipulation"
                            title="Increase Bars"
                        >
                            <span className="text-xs font-bold">+</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1" />

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2">
                <button
                    onClick={() => setMixerOpen(!isMixerOpen)}
                    className={cn(
                        "flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md transition-colors text-xs sm:text-sm touch-manipulation",
                        isMixerOpen ? "bg-zinc-700 text-zinc-100" : "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100"
                    )}
                    title="Mixer"
                >
                    <Sliders size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Mixer</span>
                </button>

                <button
                    onClick={resetProject}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors text-xs sm:text-sm touch-manipulation"
                    title="New Project"
                >
                    <FilePlus size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden md:inline">New</span>
                </button>

                <button
                    onClick={exportAudio}
                    className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-medium transition-colors text-xs sm:text-sm shadow-lg shadow-orange-900/20 touch-manipulation"
                    title="Export Audio"
                >
                    <Download size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Export</span>
                </button>
            </div>
        </div>
    );
};
