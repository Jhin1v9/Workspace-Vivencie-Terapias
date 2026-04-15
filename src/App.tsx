import React, { Suspense } from 'react';
import { Desktop } from '@/components/os/Desktop';
import { Toaster } from '@/components/ui/sonner';
import { AuraPresence } from '@/components/aura/AuraPresence';
import { useBugTrackerEvents } from '@/stores/useBugTrackerStore';

const AudioPlayerFloat = React.lazy(() =>
  import('@/components/studio/StudioSoundApp').then((module) => ({ default: module.AudioPlayerFloat }))
);

function App() {
  // Inicializa listeners de eventos do bug tracker nativo
  useBugTrackerEvents();
  
  return (
    <>
      <Desktop />
      <Suspense fallback={null}>
        <AudioPlayerFloat />
      </Suspense>
      <AuraPresence />
      <Toaster />
    </>
  );
}

export default App;

