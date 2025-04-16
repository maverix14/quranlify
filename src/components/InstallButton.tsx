
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallButton: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  
  useEffect(() => {
    // Check if the app is already installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    
    setIsStandalone(isStandaloneMode);
    
    // Capture install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  const handleInstallClick = async () => {
    if (!installPrompt) {
      toast({
        title: "Installation",
        description: "Please use your browser's install option from the menu",
        duration: 5000,
      });
      return;
    }
    
    installPrompt.prompt();
    
    const choiceResult = await installPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      toast({
        title: "Success",
        description: "Thank you for installing Focus Quran!",
        duration: 3000,
      });
      setInstallPrompt(null);
    }
  };
  
  // Don't show the button if app is already installed
  if (isStandalone) return null;
  
  return (
    <div className="w-full max-w-md mx-auto mt-6 text-center">
      <Button 
        onClick={handleInstallClick}
        className="glass-card flex items-center gap-2"
      >
        <Download size={18} />
        Install App for Offline Use
      </Button>
    </div>
  );
};

export default InstallButton;
