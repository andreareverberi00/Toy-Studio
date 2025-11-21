import React from 'react';
import { X, Play, Music, Sliders, Grid } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';

export const OnboardingOverlay: React.FC = () => {
    const { hasSeenOnboarding, setHasSeenOnboarding } = useProjectStore();

    if (hasSeenOnboarding) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-8 max-w-2xl w-full shadow-2xl relative">
                <button
                    onClick={() => setHasSeenOnboarding(true)}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-100 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome to <span className="text-orange-500">Toy Studio</span></h1>
                    <p className="text-zinc-400">A simple browser-based DAW for sketching ideas.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-start gap-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-800">
                        <div className="p-2 bg-orange-500/10 rounded-md text-orange-500">
                            <Grid size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-200 mb-1">Step Sequencer</h3>
                            <p className="text-sm text-zinc-400">Click the grid cells to toggle notes. Use the bar selector (1-4) to arrange longer loops.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-800">
                        <div className="p-2 bg-blue-500/10 rounded-md text-blue-500">
                            <Music size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-200 mb-1">Piano Roll</h3>
                            <p className="text-sm text-zinc-400">Click the piano icon on synth tracks to open the melody editor.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-800">
                        <div className="p-2 bg-green-500/10 rounded-md text-green-500">
                            <Sliders size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-200 mb-1">Mixer</h3>
                            <p className="text-sm text-zinc-400">Adjust volume, mute, and solo tracks using the Mixer panel.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-800">
                        <div className="p-2 bg-purple-500/10 rounded-md text-purple-500">
                            <Play size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-200 mb-1">Playback & Export</h3>
                            <p className="text-sm text-zinc-400">Press Space to play/stop. Export your creation to WAV when you're done.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={() => setHasSeenOnboarding(true)}
                        className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-orange-900/20 hover:scale-105"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};
