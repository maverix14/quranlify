
import React, { useState } from 'react';
import { useQuran } from '../contexts/QuranContext';
import { Play, Pause, SkipBack, SkipForward, X, List, FileAudio2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DownloadManager from './DownloadManager';

interface NavigationControlsProps {
  onOpenSurahList: () => void;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({ onOpenSurahList }) => {
  const { previousAyah, nextAyah, togglePlayAudio, isPlaying } = useQuran();
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  return (
    <>
      <div className="glass-card p-4 flex justify-center space-x-4 w-full max-w-md mx-auto mt-6">
        <Button 
          variant="outline" 
          size="icon" 
          className="btn-glass"
          onClick={() => onOpenSurahList()}
        >
          <List size={20} />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="btn-glass" 
          onClick={previousAyah}
        >
          <SkipBack size={20} />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className={`btn-glass ${isPlaying ? 'bg-blue-50' : ''}`}
          onClick={togglePlayAudio}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="btn-glass" 
          onClick={nextAyah}
        >
          <SkipForward size={20} />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="btn-glass" 
          onClick={() => setIsDownloadOpen(true)}
        >
          <FileAudio2 size={20} />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="btn-glass" 
          onClick={() => window.close()}
        >
          <X size={20} />
        </Button>
      </div>
      
      <DownloadManager 
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />
    </>
  );
};

export default NavigationControls;
