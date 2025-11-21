import { Layout } from './components/Layout';
import { TrackList } from './components/TrackList';
import { Sequencer } from './components/Sequencer';
import { PianoRoll } from './components/PianoRoll';
import { Mixer } from './components/Mixer';
import { OnboardingOverlay } from './components/OnboardingOverlay';
import { useProjectStore } from './store/useProjectStore';

function App() {
  const { activePianoRollTrackId, setActivePianoRollTrack, isMixerOpen, setMixerOpen } = useProjectStore();

  return (
    <Layout>
      <TrackList />
      <Sequencer />
      {activePianoRollTrackId && (
        <PianoRoll
          trackId={activePianoRollTrackId}
          onClose={() => setActivePianoRollTrack(null)}
        />
      )}
      <OnboardingOverlay />
      {isMixerOpen && (
        <Mixer onClose={() => setMixerOpen(false)} />
      )}
    </Layout>
  );
}

export default App;
