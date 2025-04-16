
export interface Ayah {
  number: number;
  text: string;
  audio: string;
  translation: string;
  transliteration?: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export interface ReadingProgress {
  surahNumber: number;
  ayahNumber: number;
  lastRead: string; // ISO date string
}

export interface AppSettings {
  autoPlayAudio: boolean;
  showTranslation: boolean;
  showTransliteration: boolean;
  fontSize: number;
}
