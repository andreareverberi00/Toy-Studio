import React from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { cn } from '../utils/cn';

const STEPS = Array.from({ length: 16 }, (_, i) => i);

export const Sequencer: React.FC = () => {
    const { project, currentStep, currentBar, toggleStep, setCurrentBar, isPlaying } = useProjectStore();
    const bars = Array.from({ length: project.numBars }, (_, i) => i);

    return (
        <div className="flex-shrink-0 md:flex-1 bg-zinc-900 flex flex-col md:overflow-hidden">
            {/* Bar Selector */}
            <div className="h-10 sm:h-8 border-b border-zinc-800 flex items-center px-2 gap-1 bg-zinc-900/50 sticky top-0 z-10">
                <span className="text-[10px] sm:text-[10px] font-bold text-zinc-500 uppercase mr-1 sm:mr-2">Pattern / Bar</span>
                {bars.map(bar => (
                    <button
                        key={bar}
                        onClick={() => setCurrentBar(bar)}
                        className={cn(
                            "h-8 sm:h-6 px-4 sm:px-3 rounded text-sm sm:text-xs font-bold transition-all relative overflow-hidden touch-manipulation",
                            currentBar === bar
                                ? "bg-orange-500 text-black"
                                : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300"
                        )}
                    >
                        {/* Progress bar for playback indication */}
                        {isPlaying && currentBar === bar && (
                            <div className="absolute bottom-0 left-0 h-1 bg-white/50 w-full animate-pulse" />
                        )}
                        {bar + 1}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="md:flex-1 md:overflow-y-auto">
                {project.tracks.map((track) => (
                    <div key={track.id} className="h-20 sm:h-16 border-b border-zinc-800 flex relative group">
                        {/* Background Grid */}
                        <div className="absolute inset-0 flex pointer-events-none">
                            {STEPS.map((step) => (
                                <div
                                    key={step}
                                    className={cn(
                                        "flex-1 border-r border-zinc-800/50",
                                        (step + 1) % 4 === 0 ? "border-zinc-700/50" : ""
                                    )}
                                />
                            ))}
                        </div>

                        {/* Steps */}
                        {STEPS.map((stepIndex) => {
                            const pattern = project.patterns[track.id][currentBar];
                            const step = pattern?.steps[stepIndex];
                            const isCurrent = currentStep === stepIndex && currentBar === useProjectStore.getState().currentBar;
                            const isActive = step?.active;

                            return (
                                <button
                                    key={stepIndex}
                                    onClick={() => toggleStep(track.id, stepIndex)}
                                    className={cn(
                                        "flex-1 m-[2px] sm:m-[1px] rounded-sm transition-all duration-75 relative overflow-hidden touch-manipulation min-w-[44px] sm:min-w-0",
                                        isActive ? track.color : "bg-zinc-800/30 hover:bg-zinc-700/50 active:bg-zinc-700",
                                        isCurrent && isPlaying && "ring-2 ring-white ring-opacity-80 z-10 scale-105 brightness-110",
                                        stepIndex % 4 === 0 && !isActive && "bg-zinc-700/50"
                                    )}
                                >
                                    {isCurrent && isPlaying && (
                                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};
