import React from 'react';
import { Piano } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { cn } from '../utils/cn';

export const TrackList: React.FC = () => {
    const { project, setVolume, toggleMute, toggleSolo, setActivePianoRollTrack } = useProjectStore();

    return (
        <div className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col flex-shrink-0">
            <div className="h-8 border-b border-zinc-800 flex items-center px-3 sm:px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider flex-shrink-0">
                Tracks
            </div>
            <div className="md:flex-1 md:overflow-y-auto">
                {project.tracks.map((track) => (
                    <div
                        key={track.id}
                        className="h-20 sm:h-16 border-b border-zinc-800 flex items-center px-3 gap-2 sm:gap-3 hover:bg-zinc-800/50 transition-colors group"
                    >
                        <div className={cn("w-1 h-14 sm:h-12 rounded-full", track.color)} />

                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-zinc-200 truncate mb-1.5 sm:mb-1">{track.name}</div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={track.volume}
                                    onChange={(e) => setVolume(track.id, Number(e.target.value))}
                                    className="w-full h-1.5 sm:h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-400 touch-manipulation"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 sm:gap-1">
                            {track.type === 'synth' && (
                                <button
                                    onClick={() => setActivePianoRollTrack(track.id)}
                                    className="p-1.5 sm:p-1 rounded text-[10px] font-bold w-9 h-9 sm:w-6 sm:h-6 flex items-center justify-center bg-zinc-800 text-zinc-500 hover:text-zinc-100 transition-colors mb-1 touch-manipulation"
                                    title="Piano Roll"
                                >
                                    <Piano size={16} className="sm:w-3.5 sm:h-3.5" />
                                </button>
                            )}
                            <button
                                onClick={() => toggleMute(track.id)}
                                className={cn(
                                    "p-1.5 sm:p-1 rounded text-xs sm:text-[10px] font-bold w-9 h-9 sm:w-6 sm:h-6 flex items-center justify-center transition-colors touch-manipulation",
                                    track.mute ? "bg-red-500/20 text-red-500" : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                                )}
                                title="Mute"
                            >
                                M
                            </button>
                            <button
                                onClick={() => toggleSolo(track.id)}
                                className={cn(
                                    "p-1.5 sm:p-1 rounded text-xs sm:text-[10px] font-bold w-9 h-9 sm:w-6 sm:h-6 flex items-center justify-center transition-colors touch-manipulation",
                                    track.solo ? "bg-green-500/20 text-green-500" : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                                )}
                                title="Solo"
                            >
                                S
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
