import React from 'react';
import { X } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { cn } from '../utils/cn';

const SCALE = ['C', 'D', 'D#', 'F', 'G', 'G#', 'A#']; // C Minor
const OCTAVES = [4, 3]; // Top to bottom

export const PianoRoll: React.FC<{ trackId: string; onClose: () => void }> = ({ trackId, onClose }) => {
    const { project, toggleStep, currentStep, currentBar } = useProjectStore();
    const track = project.tracks.find(t => t.id === trackId);

    if (!track) return null;

    const pattern = project.patterns[trackId][currentBar];

    if (!pattern) return null;

    // Generate rows: C4, A#3, G#3... down to C3
    const rows: { note: string; label: string; isRoot: boolean }[] = [];
    OCTAVES.forEach(octave => {
        [...SCALE].reverse().forEach(note => {
            rows.push({
                note: `${note}${octave}`, // "C4", "D#4"
                label: `${note}${octave}`,
                isRoot: note === 'C'
            });
        });
    });

    return (
        <div className="fixed inset-0 md:inset-x-0 md:bottom-0 md:top-auto md:h-96 bg-zinc-900 border-t border-zinc-700 shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom duration-300">
            <div className="h-12 sm:h-10 flex items-center justify-between px-3 sm:px-4 border-b border-zinc-800 bg-zinc-800">
                <div className="font-bold text-sm sm:text-base text-zinc-200 flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", track.color)} />
                    <span className="truncate">{track.name}</span>
                    <span className="text-zinc-500 font-normal text-xs ml-1 sm:ml-2 hidden sm:inline">Piano Roll (C Minor) - Bar {currentBar + 1}</span>
                    <span className="text-zinc-500 font-normal text-xs ml-1 sm:hidden">Bar {currentBar + 1}</span>
                </div>
                <button onClick={onClose} className="p-1.5 sm:p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-zinc-100 touch-manipulation">
                    <X size={20} className="sm:w-[18px] sm:h-[18px]" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex">
                {/* Keys (Left) */}
                <div className="w-14 sm:w-16 flex-shrink-0 border-r border-zinc-800 bg-zinc-900 sticky left-0 z-10">
                    {rows.map((row) => (
                        <div
                            key={row.note}
                            className={cn(
                                "h-11 sm:h-8 border-b border-zinc-800 flex items-center justify-end px-1.5 sm:px-2 text-xs font-medium",
                                row.label.includes('#') ? "bg-zinc-900 text-zinc-500" : "bg-zinc-800 text-zinc-300",
                                row.isRoot && "text-orange-400"
                            )}
                        >
                            {row.label}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-x-auto relative">
                    <div className="absolute inset-0 flex flex-col min-w-max">
                        {rows.map((row) => (
                            <div key={row.note} className="h-11 sm:h-8 flex border-b border-zinc-800/50">
                                {Array.from({ length: 16 }).map((_, stepIndex) => {
                                    const step = pattern.steps[stepIndex];
                                    const isActive = step?.active && step?.note === row.note;
                                    const isBeat = stepIndex % 4 === 0;
                                    const isCurrent = currentStep === stepIndex;

                                    return (
                                        <button
                                            key={stepIndex}
                                            className={cn(
                                                "w-14 sm:w-12 border-r border-zinc-800/30 relative cursor-pointer hover:bg-zinc-800/20 active:bg-zinc-800/30 focus:outline-none touch-manipulation",
                                                isBeat && "border-zinc-800",
                                                isCurrent && "bg-zinc-800/10"
                                            )}
                                            onClick={() => toggleStep(trackId, stepIndex, row.note)}
                                        >
                                            {isActive && (
                                                <div className={cn(
                                                    "absolute inset-1 sm:inset-0.5 rounded-sm shadow-sm",
                                                    track.color
                                                )} />
                                            )}
                                            {/* Ghost note if step is active but different note? */}
                                            {step?.active && step?.note !== row.note && (
                                                <div className="absolute inset-1 sm:inset-0.5 bg-zinc-800/50 rounded-sm opacity-20" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
