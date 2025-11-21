import React from 'react';
import { X } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { cn } from '../utils/cn';

export const Mixer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { project, setVolume, toggleMute, toggleSolo } = useProjectStore();

    return (
        <div className="fixed inset-0 md:inset-auto md:right-4 md:top-20 md:bottom-4 md:w-80 bg-zinc-900 border md:border border-zinc-700 shadow-2xl md:rounded-lg flex flex-col z-40 animate-in slide-in-from-right duration-300">
            <div className="h-14 sm:h-12 md:h-10 flex items-center justify-between px-4 border-b border-zinc-800 bg-zinc-800 md:rounded-t-lg">
                <span className="font-bold text-base sm:text-sm text-zinc-200">Mixer</span>
                <button onClick={onClose} className="p-2 sm:p-1.5 md:p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-zinc-100 touch-manipulation">
                    <X size={20} className="sm:w-5 sm:h-5 md:w-[18px] md:h-[18px]" />
                </button>
            </div>

            <div className="flex-1 overflow-x-auto p-4 flex gap-6 sm:gap-4 justify-center md:justify-start">
                {project.tracks.map((track) => (
                    <div key={track.id} className="flex flex-col items-center h-full min-w-[4rem] sm:min-w-[3rem]">
                        {/* Re-implementing the slider cleanly */}
                        <div className="h-64 sm:h-56 md:h-48 w-10 sm:w-9 md:w-8 bg-zinc-800 rounded-lg relative mb-3 sm:mb-2">
                            <div
                                className={cn("absolute bottom-0 left-0 right-0 rounded-b-lg transition-all", track.color)}
                                style={{ height: `${track.volume * 100}%`, opacity: 0.3 }}
                            />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={track.volume}
                                onChange={(e) => setVolume(track.id, Number(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer touch-manipulation"
                            />
                            {/* Fader Handle Visual */}
                            <div
                                className="absolute left-0 right-0 h-5 sm:h-4 bg-zinc-200 rounded shadow-md pointer-events-none"
                                style={{ bottom: `calc(${track.volume * 100}% - ${10}px)` }}
                            />
                        </div>

                        <div className="flex flex-col gap-2 sm:gap-1.5 md:gap-1 w-full">
                            <button
                                onClick={() => toggleMute(track.id)}
                                className={cn(
                                    "w-full py-2 sm:py-1.5 md:py-1 rounded text-xs sm:text-[11px] md:text-[10px] font-bold transition-colors touch-manipulation",
                                    track.mute ? "bg-red-500 text-black" : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                M
                            </button>
                            <button
                                onClick={() => toggleSolo(track.id)}
                                className={cn(
                                    "w-full py-2 sm:py-1.5 md:py-1 rounded text-xs sm:text-[11px] md:text-[10px] font-bold transition-colors touch-manipulation",
                                    track.solo ? "bg-green-500 text-black" : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                S
                            </button>
                        </div>

                        <div className="mt-3 sm:mt-2 text-xs sm:text-[11px] md:text-[10px] font-medium text-zinc-400 truncate w-full text-center" title={track.name}>
                            {track.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
