
import React, { useState, useEffect } from 'react';
import { useQuran } from '../contexts/QuranContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

interface SurahSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const SurahSelector: React.FC<SurahSelectorProps> = ({ isOpen, onClose }) => {
  const { navigateToAyah, currentSurah, currentAyah, allSurahs, isLoading } = useQuran();
  const [selectedSurah, setSelectedSurah] = useState(currentSurah.number);
  const [selectedAyah, setSelectedAyah] = useState(currentAyah.number);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Update selected values when current surah/ayah changes
  useEffect(() => {
    setSelectedSurah(currentSurah.number);
    setSelectedAyah(currentAyah.number);
  }, [currentSurah.number, currentAyah.number]);
  
  const handleGo = () => {
    navigateToAyah(selectedSurah, selectedAyah);
    onClose();
  };

  // Filter surahs based on search query
  const filteredSurahs = allSurahs.filter(
    surah => 
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.number.toString().includes(searchQuery)
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Jump to Surah/Ayah</DialogTitle>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Input
            placeholder="Search surah by name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        </div>
        
        <div className="grid gap-4">
          <ScrollArea className="h-60 rounded-md border">
            <div className="p-4">
              {filteredSurahs.length > 0 ? (
                filteredSurahs.map((surah) => (
                  <div 
                    key={surah.number}
                    className={`p-2 mb-1 rounded cursor-pointer hover:bg-blue-50 ${
                      selectedSurah === surah.number ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => setSelectedSurah(surah.number)}
                  >
                    <div className="flex justify-between">
                      <span>{surah.number}. {surah.englishName}</span>
                      <span className="text-gray-600 text-sm">{surah.numberOfAyahs} ayahs</span>
                    </div>
                    <div className="text-xs text-gray-500">{surah.englishNameTranslation}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">No surahs found</div>
              )}
            </div>
          </ScrollArea>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="ayah" className="text-right">
              Ayah
            </label>
            <div className="col-span-3">
              <Input
                id="ayah"
                type="number"
                min={1}
                max={allSurahs.find(s => s.number === selectedSurah)?.numberOfAyahs || 1}
                value={selectedAyah}
                onChange={(e) => setSelectedAyah(Number(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">
                (1-{allSurahs.find(s => s.number === selectedSurah)?.numberOfAyahs || '...'})
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="default" 
            onClick={handleGo}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Go'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurahSelector;
