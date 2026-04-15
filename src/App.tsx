import React, { Suspense } from 'react';
import { Desktop } from '@/components/os/Desktop';
import { Toaster } from '@/components/ui/sonner';
import { AuraPresence } from '@/components/aura/AuraPresence';
import { useBugTrackerEvents } from '@/stores/useBugTrackerStore';
import { BugDetectorProvider, BugDetectorFloatingButton, useBugDetectorAdvanced } from '@auris/bug-detector/react';

const AudioPlayerFloat = React.lazy(() =>
  import('@/components/studio/StudioSoundApp').then((module) => ({ default: module.AudioPlayerFloat }))
);

function AppContent() {
  useBugTrackerEvents();
  const { openPanel } = useBugDetectorAdvanced();
  return (
    <>
      <Desktop />
      <Suspense fallback={null}><AudioPlayerFloat /></Suspense>
      <AuraPresence />
      <Toaster />
      <BugDetectorFloatingButton position="bottom-right" />
      <button onClick={openPanel} title="Ver Reports" style={{ position: 'fixed', bottom: 90, right: 20, zIndex: 2147483647, width: 48, height: 48, borderRadius: '50%', background: '#10b981', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>📋</button>
    </>
  );
}

function App() {
  return (
    <BugDetectorProvider config={{ shortcut: 'ctrl+shift+d', headless: false }}>
      <AppContent />
    </BugDetectorProvider>
  );
}

export default App;
