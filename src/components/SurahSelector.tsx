
import React, { useState } from 'react';
import { useQuran } from '../contexts/QuranContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sampleSurah } from '../data/sampleSurah';

interface SurahSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const SurahSelector: React.FC<SurahSelectorProps> = ({ isOpen, onClose }) => {
  const { navigateToAyah, currentSurah, currentAyah } = useQuran();
  const [selectedSurah, setSelectedSurah] = useState(currentSurah.number);
  const [selectedAyah, setSelectedAyah] = useState(currentAyah.number);
  
  // In a full app, this would be a list of all surahs
  const surahList = [sampleSurah];
  
  const handleGo = () => {
    navigateToAyah(selectedSurah, selectedAyah);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Jump to Surah/Ayah</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="surah" className="text-right">
              Surah
            </label>
            <select 
              id="surah" 
              className="col-span-3 p-2 rounded border" 
              value={selectedSurah}
              onChange={(e) => setSelectedSurah(Number(e.target.value))}
            >
              {surahList.map((surah) => (
                <option key={surah.number} value={surah.number}>
                  {surah.number}. {surah.englishName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="ayah" className="text-right">
              Ayah
            </label>
            <div className="col-span-3">
              <Input
                id="ayah"
                type="number"
                min={1}
                max={sampleSurah.numberOfAyahs}
                value={selectedAyah}
                onChange={(e) => setSelectedAyah(Number(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">
                (1-{sampleSurah.numberOfAyahs})
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="default" 
            onClick={handleGo}
          >
            Go
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurahSelector;
