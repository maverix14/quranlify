
import React, { useState, useEffect } from 'react';
import { QuranProvider } from '../contexts/QuranContext';
import AyahDisplay from '../components/AyahDisplay';
import NavigationControls from '../components/NavigationControls';
import SurahSelector from '../components/SurahSelector';
import SettingsPanel from '../components/SettingsPanel';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [isSurahSelectorOpen, setSurahSelectorOpen] = useState(false);
  const [installedPWA, setInstalledPWA] = useState(false);
  
  // Check if the app is installed as PWA
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setInstalledPWA(isStandalone);
    
    // Show welcome message once per session
    const hasShownWelcome = sessionStorage.getItem('welcomed');
    if (!hasShownWelcome) {
      toast({
        title: "Welcome to Focus Quran",
        description: "Read one ayah at a time to improve your focus",
        duration: 5000,
      });
      sessionStorage.setItem('welcomed', 'true');
    }
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceWorker.js')
          .then(registration => {
            console.log('SW registered:', registration);
          })
          .catch(error => {
            console.log('SW registration failed:', error);
          });
      });
    }
  }, []);
  
  const handleOpenSurahList = () => {
    setSurahSelectorOpen(true);
  };

  return (
    <QuranProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
        <header className="w-full max-w-2xl mx-auto mb-6 text-center">
          <h1 className="text-2xl font-semibold text-quran-blue">Focus Quran</h1>
          <p className="text-sm text-gray-600">One ayah at a time</p>
        </header>
        
        <main className="flex-1 w-full flex flex-col items-center justify-center">
          <AyahDisplay />
          <NavigationControls onOpenSurahList={handleOpenSurahList} />
        </main>
        
        <SurahSelector 
          isOpen={isSurahSelectorOpen} 
          onClose={() => setSurahSelectorOpen(false)} 
        />
        
        <SettingsPanel />
        
        {!installedPWA && (
          <div className="w-full max-w-md mx-auto mt-6 text-center text-sm text-gray-600">
            <p>
              Install this app on your device for offline use.
              Add to home screen from your browser menu.
            </p>
          </div>
        )}
      </div>
      <Toaster />
    </QuranProvider>
  );
};

export default Index;
