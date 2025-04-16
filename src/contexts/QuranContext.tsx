
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Surah, Ayah, ReadingProgress, AppSettings } from '../types';
import { getProgress, saveProgress, getSettings, saveSettings } from '../utils/storage';
import { sampleSurah } from '../data/sampleSurah';
import { getAllSurahs, getSurah } from '../utils/api';
import { toast } from '@/components/ui/use-toast';

interface QuranContextType {
  currentSurah: Surah;
  currentAyah: Ayah;
  allSurahs: Surah[];
  settings: AppSettings;
  isPlaying: boolean;
  isLoading: boolean;
  navigateToAyah: (surahNumber: number, ayahNumber: number) => void;
  nextAyah: () => void;
  previousAyah: () => void;
  togglePlayAudio: () => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const QuranContext = createContext<QuranContextType | undefined>(undefined);

export const QuranProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allSurahs, setAllSurahs] = useState<Surah[]>([sampleSurah]);
  const [currentSurah, setCurrentSurah] = useState<Surah>(sampleSurah);
  const [currentAyah, setCurrentAyah] = useState<Ayah>(sampleSurah.ayahs[0]);
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all surahs on initial load
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const surahs = await getAllSurahs();
        if (surahs && surahs.length > 0) {
          setAllSurahs(surahs);
        }
      } catch (error) {
        console.error("Error fetching surahs:", error);
        toast({
          title: "Error loading Quran data",
          description: "Could not load the list of surahs. Please check your internet connection.",
          variant: "destructive"
        });
      }
    };
    
    fetchSurahs();
  }, []);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.onended = () => setIsPlaying(false);
    setAudioRef(audio);
    
    // Load last progress
    const progress = getProgress();
    if (progress) {
      navigateToAyah(progress.surahNumber, progress.ayahNumber);
    }
    
    return () => {
      if (audioRef) {
        audioRef.pause();
        audioRef.src = '';
      }
    };
  }, []);

  // Update audio when ayah changes
  useEffect(() => {
    if (audioRef && currentAyah) {
      audioRef.src = currentAyah.audio;
      if (settings.autoPlayAudio) {
        audioRef.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.error("Error playing audio:", err);
            toast({
              title: "Audio playback failed",
              description: "Try downloading the surah for offline use.",
              variant: "destructive"
            });
          });
      }
    }
    
    // Save progress
    if (currentSurah && currentAyah) {
      saveProgress({
        surahNumber: currentSurah.number,
        ayahNumber: currentAyah.number,
        lastRead: new Date().toISOString()
      });
    }
  }, [currentAyah, currentSurah, settings.autoPlayAudio]);

  const navigateToAyah = async (surahNumber: number, ayahNumber: number) => {
    setIsLoading(true);
    
    try {
      // Check if we need to load a different surah
      if (!currentSurah || currentSurah.number !== surahNumber) {
        const surah = await getSurah(surahNumber);
        
        if (surah) {
          setCurrentSurah(surah);
          
          // Find the ayah in the surah
          const ayahIndex = Math.min(Math.max(1, ayahNumber), surah.numberOfAyahs) - 1;
          setCurrentAyah(surah.ayahs[ayahIndex]);
        } else {
          // If surah couldn't be loaded, show error and use sample
          toast({
            title: "Error loading surah",
            description: "Could not load the requested surah. Using sample data instead.",
            variant: "destructive"
          });
          setCurrentSurah(sampleSurah);
          setCurrentAyah(sampleSurah.ayahs[0]);
        }
      } else {
        // Same surah, different ayah
        const ayahIndex = Math.min(Math.max(1, ayahNumber), currentSurah.numberOfAyahs) - 1;
        setCurrentAyah(currentSurah.ayahs[ayahIndex]);
      }
    } catch (error) {
      console.error("Error navigating to ayah:", error);
      toast({
        title: "Navigation error",
        description: "Could not navigate to the requested ayah.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextAyah = () => {
    if (currentSurah && currentAyah) {
      const currentAyahNumber = currentAyah.number;
      const totalAyahs = currentSurah.numberOfAyahs;
      
      if (currentAyahNumber < totalAyahs) {
        // Move to next ayah in current surah
        navigateToAyah(currentSurah.number, currentAyahNumber + 1);
      } else {
        // Move to the next surah, first ayah
        const nextSurahNumber = currentSurah.number + 1;
        // Check if next surah exists (max 114 surahs in Quran)
        if (nextSurahNumber <= 114) {
          navigateToAyah(nextSurahNumber, 1);
        } else {
          // Wrap around to the first surah
          navigateToAyah(1, 1);
        }
      }
    }
  };

  const previousAyah = () => {
    if (currentSurah && currentAyah) {
      const currentAyahNumber = currentAyah.number;
      
      if (currentAyahNumber > 1) {
        // Move to previous ayah in current surah
        navigateToAyah(currentSurah.number, currentAyahNumber - 1);
      } else {
        // Move to the previous surah, last ayah
        const prevSurahNumber = currentSurah.number - 1;
        if (prevSurahNumber >= 1) {
          // Get the number of ayahs in the previous surah
          const prevSurah = allSurahs.find(s => s.number === prevSurahNumber);
          if (prevSurah) {
            navigateToAyah(prevSurahNumber, prevSurah.numberOfAyahs);
          } else {
            // If we can't determine the previous surah's length, fetch it
            navigateToAyah(prevSurahNumber, 1);  // Will load the surah and we can navigate to the last ayah after
          }
        } else {
          // Wrap around to the last surah (114)
          navigateToAyah(114, 1);
        }
      }
    }
  };

  const togglePlayAudio = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
        setIsPlaying(false);
      } else {
        audioRef.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.error("Error playing audio:", err);
            toast({
              title: "Audio playback failed",
              description: "Try downloading the surah for offline use.",
              variant: "destructive"
            });
          });
      }
    }
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  return (
    <QuranContext.Provider
      value={{
        currentSurah,
        currentAyah,
        allSurahs,
        settings,
        isPlaying,
        isLoading,
        navigateToAyah,
        nextAyah,
        previousAyah,
        togglePlayAudio,
        updateSettings,
      }}
    >
      {children}
    </QuranContext.Provider>
  );
};

export const useQuran = () => {
  const context = useContext(QuranContext);
  if (context === undefined) {
    throw new Error('useQuran must be used within a QuranProvider');
  }
  return context;
};
