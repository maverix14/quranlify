import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileAudio2, Download, Check, Search, Loader2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useQuran } from '../contexts/QuranContext';
import { getSurah } from '../utils/api';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

interface DownloadManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DownloadState {
  [surahNumber: number]: 'idle' | 'downloading' | 'completed' | 'error';
}

const DownloadManager: React.FC<DownloadManagerProps> = ({ isOpen, onClose }) => {
  const { allSurahs } = useQuran();
  const [downloadStates, setDownloadStates] = useState<DownloadState>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    try {
      const savedStates = localStorage.getItem('downloadedSurahs');
      if (savedStates) {
        const parsedStates: DownloadState = JSON.parse(savedStates);
        setDownloadStates(parsedStates);
      }
    } catch (error) {
      console.error('Error loading download states:', error);
    }
  }, []);
  
  const isDownloaded = (surahNumber: number) => {
    return downloadStates[surahNumber] === 'completed';
  };
  
  const handleDownload = async (surahNumber: number) => {
    setDownloadStates(prev => ({
      ...prev,
      [surahNumber]: 'downloading'
    }));
    
    try {
      const surah = await getSurah(surahNumber);
      
      if (!surah) {
        throw new Error('Failed to fetch surah data');
      }
      
      const cacheKey = `surah_${surahNumber}`;
      localStorage.setItem(cacheKey, JSON.stringify(surah));
      
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        setTimeout(() => {
          const newStates = {
            ...downloadStates,
            [surahNumber]: 'completed'
          };
          
          setDownloadStates(newStates);
          
          localStorage.setItem('downloadedSurahs', JSON.stringify(newStates));
          
          toast({
            title: "Download Complete",
            description: `Surah ${surah.englishName} is now available offline`,
            duration: 3000,
          });
        }, 2000);
      } else {
        toast({
          title: "Limited Offline Support",
          description: "Your browser doesn't fully support offline features",
          duration: 3000,
        });
        
        const newStates = {
          ...downloadStates,
          [surahNumber]: 'completed'
        };
        
        setDownloadStates(newStates);
        localStorage.setItem('downloadedSurahs', JSON.stringify(newStates));
      }
    } catch (error) {
      console.error(`Error downloading Surah ${surahNumber}:`, error);
      
      setDownloadStates(prev => ({
        ...prev,
        [surahNumber]: 'error'
      }));
      
      toast({
        title: "Download Failed",
        description: `Could not download Surah ${surahNumber}. Please try again.`,
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  const filteredSurahs = allSurahs.filter(
    surah => 
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.number.toString().includes(searchQuery)
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download Surah for Offline Use</DialogTitle>
          <DialogDescription>
            Download the audio files to use the app without internet connection.
          </DialogDescription>
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
        
        <ScrollArea className="h-60">
          <div className="space-y-2">
            {filteredSurahs.map((surah) => (
              <div 
                key={surah.number} 
                className="border rounded-md p-3 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium">
                    {surah.number}. {surah.englishName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {surah.numberOfAyahs} ayahs
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(surah.number)}
                  disabled={downloadStates[surah.number] === 'downloading'}
                  className="flex items-center gap-2"
                >
                  {downloadStates[surah.number] === 'downloading' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : isDownloaded(surah.number) ? (
                    <>
                      <Check size={16} className="text-green-500" />
                      Downloaded
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Download
                    </>
                  )}
                </Button>
              </div>
            ))}
            
            {filteredSurahs.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No surahs found matching your search
              </div>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadManager;
