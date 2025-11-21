import React from 'react';
import { X } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { cn } from '../utils/cn';

export const Mixer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { project, setVolume, toggleMute, toggleSolo } = useProjectStore();

    return (
        <div className="fixed right-4 top-20 bottom-4 w-80 bg-zinc-900 border border-zinc-700 shadow-2xl rounded-lg flex flex-col z-40 animate-in slide-in-from-right duration-300">
            <div className="h-10 flex items-center justify-between px-4 border-b border-zinc-800 bg-zinc-800 rounded-t-lg">
                <span className="font-bold text-zinc-200">Mixer</span>
                <button onClick={onClose} className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-zinc-100">
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-x-auto p-4 flex gap-4">
                {project.tracks.map((track) => (
                    <div key={track.id} className="flex flex-col items-center h-full min-w-[3rem]">
                        <div className="flex-1 relative w-8 bg-zinc-800 rounded-full overflow-hidden group">
                            {/* Fader track */}
                            <div className="absolute inset-x-0 bottom-0 bg-zinc-700/50 h-full" />

                            {/* Volume Level (Visual only for now, mapped to volume) */}
                            <div
                                className={cn("absolute inset-x-0 bottom-0 transition-all duration-100 opacity-50", track.color)}
                                style={{ height: `${track.volume * 100}%` }}
                            />

                            {/* Input Range Overlay */}
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={track.volume}
                                onChange={(e) => setVolume(track.id, Number(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                title={`Volume: ${Math.round(track.volume * 100)}%`}
                                style={{ transform: 'rotate(-90deg) translateX(-100%)', transformOrigin: '0 0', width: '100vh' }} // Hacky vertical slider
                            />
                            {/* Better Vertical Slider Approach: Use a container and standard range input rotated, or just a custom UI. 
                   For simplicity, let's use a standard input rotated with CSS. 
               */}
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={track.volume}
                                onChange={(e) => setVolume(track.id, Number(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            // The previous hack was weird. Let's just use a vertical flex layout for the slider.
                            />
                            {/* Actually, standard <input type="range"> is hard to style vertically cross-browser without rotation.
                   Let's stick to the visual bar + invisible input for "touch" area, 
                   OR just use a rotated input that is visible.
               */}
                        </div>

                        {/* Re-implementing the slider cleanly */}
                        <div className="h-48 w-8 bg-zinc-800 rounded-lg relative mb-2">
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
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {/* Fader Handle Visual */}
                            <div
                                className="absolute left-0 right-0 h-4 bg-zinc-200 rounded shadow-md pointer-events-none"
                                style={{ bottom: `calc(${track.volume * 100}% - 8px)` }}
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                            <button
                                onClick={() => toggleMute(track.id)}
                                className={cn(
                                    "w-full py-1 rounded text-[10px] font-bold transition-colors",
                                    track.mute ? "bg-red-500 text-black" : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                M
                            </button>
                            <button
                                onClick={() => toggleSolo(track.id)}
                                className={cn(
                                    "w-full py-1 rounded text-[10px] font-bold transition-colors",
                                    track.solo ? "bg-green-500 text-black" : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                S
                            </button>
                        </div>

                        <div className="mt-2 text-[10px] font-medium text-zinc-400 truncate w-full text-center" title={track.name}>
                            {track.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
