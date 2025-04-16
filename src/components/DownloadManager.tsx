
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileAudio2, Download } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { sampleSurah } from '../data/sampleSurah';

interface DownloadManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DownloadManager: React.FC<DownloadManagerProps> = ({ isOpen, onClose }) => {
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  
  // In a real app, this would check if the surah is already downloaded
  const isDownloaded = () => {
    // Check if we already have the audio files in IndexedDB or cache
    return false; // Mock implementation
  };
  
  const handleDownload = async (surahNumber: number) => {
    setDownloadingIndex(surahNumber);
    
    // Mock implementation - in a real app, this would:
    // 1. Download all audio files for the surah
    // 2. Store them in IndexedDB
    // 3. Update the UI to show download status
    
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${sampleSurah.englishName} is now available offline`,
        duration: 3000,
      });
      setDownloadingIndex(null);
    }, 2000);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download Surah for Offline Use</DialogTitle>
          <DialogDescription>
            Download the audio files to use the app without internet connection.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="border rounded-md p-4 mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">{sampleSurah.englishName}</h3>
              <p className="text-sm text-gray-500">{sampleSurah.numberOfAyahs} ayahs</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(sampleSurah.number)}
              disabled={downloadingIndex === sampleSurah.number}
              className="flex items-center gap-2"
            >
              {downloadingIndex === sampleSurah.number ? (
                "Downloading..."
              ) : (
                <>
                  <Download size={16} />
                  Download
                </>
              )}
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-2">
            Note: In a complete app, this would download the actual audio files.
            This is a prototype demonstration.
          </p>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadManager;
