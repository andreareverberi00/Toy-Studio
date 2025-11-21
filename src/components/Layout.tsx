import React, { useEffect } from 'react';
import { TransportBar } from './TransportBar';
import { useProjectStore } from '../store/useProjectStore';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const initAudio = useProjectStore(state => state.initAudio);

    useEffect(() => {
        // Initialize audio on first user interaction (click anywhere)
        const handleInit = () => {
            initAudio();
            window.removeEventListener('click', handleInit);
            window.removeEventListener('keydown', handleInit);
        };

        window.addEventListener('click', handleInit);
        window.addEventListener('keydown', handleInit);

        return () => {
            window.removeEventListener('click', handleInit);
            window.removeEventListener('keydown', handleInit);
        };
    }, [initAudio]);

    return (
        <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans selection:bg-orange-500/30">
            <TransportBar />
            <main className="flex-1 overflow-hidden relative flex">
                {children}
            </main>
        </div>
    );
};
