
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Surah, Ayah, ReadingProgress, AppSettings } from '../types';
import { getProgress, saveProgress, getSettings, saveSettings } from '../utils/storage';
import { sampleSurah } from '../data/sampleSurah';

interface QuranContextType {
  currentSurah: Surah;
  currentAyah: Ayah;
  settings: AppSettings;
  isPlaying: boolean;
  navigateToAyah: (surahNumber: number, ayahNumber: number) => void;
  nextAyah: () => void;
  previousAyah: () => void;
  togglePlayAudio: () => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const QuranContext = createContext<QuranContextType | undefined>(undefined);

export const QuranProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availableSurahs, setAvailableSurahs] = useState<Surah[]>([sampleSurah]);
  const [currentSurah, setCurrentSurah] = useState<Surah>(sampleSurah);
  const [currentAyah, setCurrentAyah] = useState<Ayah>(sampleSurah.ayahs[0]);
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

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
          .catch(err => console.error("Error playing audio:", err));
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

  const navigateToAyah = (surahNumber: number, ayahNumber: number) => {
    // For the sample, we only have one surah
    // In a full app, we would load the correct surah
    const selectedSurah = sampleSurah;
    
    if (selectedSurah) {
      setCurrentSurah(selectedSurah);
      
      // Find the ayah in the surah
      const ayahIndex = Math.min(Math.max(1, ayahNumber), selectedSurah.numberOfAyahs) - 1;
      setCurrentAyah(selectedSurah.ayahs[ayahIndex]);
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
        // Here we would move to the next surah, but for the sample we just wrap around
        navigateToAyah(currentSurah.number, 1);
      }
    }
  };

  const previousAyah = () => {
    if (currentSurah && currentAyah) {
      const currentAyahNumber = currentAyah.number;
      const totalAyahs = currentSurah.numberOfAyahs;
      
      if (currentAyahNumber > 1) {
        // Move to previous ayah in current surah
        navigateToAyah(currentSurah.number, currentAyahNumber - 1);
      } else {
        // Here we would move to the previous surah, but for the sample we just wrap around
        navigateToAyah(currentSurah.number, totalAyahs);
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
          .catch(err => console.error("Error playing audio:", err));
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
        settings,
        isPlaying,
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
