
import React from 'react';
import { useQuran } from '../contexts/QuranContext';
import { Loader2 } from 'lucide-react';

const AyahDisplay: React.FC = () => {
  const { currentSurah, currentAyah, settings, isLoading } = useQuran();

  if (isLoading) {
    return (
      <div className="glass-card p-6 w-full max-w-2xl mx-auto flex flex-col items-center justify-center" style={{ minHeight: '300px' }}>
        <Loader2 className="h-12 w-12 animate-spin text-quran-blue" />
        <p className="mt-4 text-gray-600">Loading ayah...</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 w-full max-w-2xl mx-auto animate-fade-in">
      <div className="mb-4 text-sm text-gray-600">
        <span>
          {currentSurah.englishName} ({currentSurah.name}) - Ayah {currentAyah.number}/{currentSurah.numberOfAyahs}
        </span>
      </div>
      
      <div 
        className="text-right mb-6 leading-loose" 
        style={{ fontSize: `${1.5 * settings.fontSize}rem` }}
      >
        <p className="font-arabic">{currentAyah.text}</p>
      </div>
      
      {settings.showTransliteration && (
        <div className="mb-4 italic text-gray-600">
          <p>{currentAyah.transliteration}</p>
        </div>
      )}
      
      {settings.showTranslation && (
        <div className="text-gray-700">
          <p style={{ fontSize: `${1 * settings.fontSize}rem` }}>{currentAyah.translation}</p>
        </div>
      )}
    </div>
  );
};

export default AyahDisplay;
