import React, { useState, useEffect } from 'react';
import { QuranProvider } from '../contexts/QuranContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { useTheme } from '../contexts/ThemeContext';
import AyahDisplay from '../components/AyahDisplay';
import NavigationControls from '../components/NavigationControls';
import SurahSelector from '../components/SurahSelector';
import SettingsPanel from '../components/SettingsPanel';
import InstallButton from '../components/InstallButton';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';

const Logo = () => {
  const { theme } = useTheme();
  return (
    <img 
      src={theme === 'dark' ? '/lovable-uploads/433fb92b-91c4-4d27-9472-c3c91767b9d9.png' : '/lovable-uploads/9ee55ad8-9c60-4271-b852-3037257b4f00.png'} 
      alt="Quranlify" 
      className="h-12 w-auto"
    />
  );
};

const Index = () => {
  const [isSurahSelectorOpen, setSurahSelectorOpen] = useState(false);
  
  // Show welcome message once per session
  useEffect(() => {
    const hasShownWelcome = sessionStorage.getItem('welcomed');
    if (!hasShownWelcome) {
      toast({
        title: "Welcome to Quranlify",
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
    <ThemeProvider>
      <QuranProvider>
        <div className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 dark:bg-gray-900 dark:text-white transition-colors">
          <header className="w-full max-w-2xl mx-auto mb-6 glass-card p-4 flex justify-between items-center dark:bg-gray-800/50">
            <InstallButton className="btn-glass dark:hover:bg-gray-700" />
            <div className="flex items-center justify-center">
              <Logo />
            </div>
            <SettingsPanel className="btn-glass dark:hover:bg-gray-700" />
          </header>
          
          <main className="flex-1 w-full flex flex-col items-center justify-center mb-6">
            <AyahDisplay />
          </main>
          
          <footer className="w-full fixed bottom-0 left-0 right-0 pb-4 pt-2 px-4 bg-transparent">
            <NavigationControls onOpenSurahList={handleOpenSurahList} />
          </footer>
          
          <SurahSelector 
            isOpen={isSurahSelectorOpen} 
            onClose={() => setSurahSelectorOpen(false)} 
          />
        </div>
        <Toaster />
      </QuranProvider>
    </ThemeProvider>
  );
};

export default Index;
