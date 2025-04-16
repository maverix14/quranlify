
import { Surah, Ayah } from '../types';

const BASE_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1';

// Get list of all Surahs (chapters)
export const getAllSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await fetch(`${BASE_URL}/editions/eng-mustafakhattab/chapters.json`);
    if (!response.ok) throw new Error('Failed to fetch surahs');
    
    const data = await response.json();
    
    // Map the API response to our Surah type
    return data.chapters.map((chapter: any) => ({
      number: chapter.chapter,
      name: chapter.arabicName || chapter.name, // Arabic name
      englishName: chapter.name,
      englishNameTranslation: chapter.translation,
      numberOfAyahs: chapter.verses,
      ayahs: [] // Will be populated when fetching specific surah
    }));
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return [];
  }
};

// Get a specific Surah with all ayahs
export const getSurah = async (surahNumber: number): Promise<Surah | null> => {
  try {
    // Get surah metadata
    const surahsResponse = await fetch(`${BASE_URL}/editions/eng-mustafakhattab/chapters.json`);
    if (!surahsResponse.ok) throw new Error('Failed to fetch surah metadata');
    
    const surahsData = await surahsResponse.json();
    const surahMetadata = surahsData.chapters.find((c: any) => c.chapter === surahNumber);
    
    if (!surahMetadata) {
      throw new Error(`Surah ${surahNumber} not found`);
    }
    
    // Get Arabic text
    const arabicResponse = await fetch(`${BASE_URL}/editions/ara-quranindopak/${surahNumber}.json`);
    if (!arabicResponse.ok) throw new Error('Failed to fetch Arabic text');
    
    const arabicData = await arabicResponse.json();
    
    // Get English translation
    const translationResponse = await fetch(`${BASE_URL}/editions/eng-mustafakhattab/${surahNumber}.json`);
    if (!translationResponse.ok) throw new Error('Failed to fetch translation');
    
    const translationData = await translationResponse.json();
    
    // Construct the Surah object with ayahs
    const ayahs: Ayah[] = arabicData.chapter.map((verse: any, index: number) => {
      const translationVerse = translationData.chapter[index];
      
      return {
        number: verse.verse,
        text: verse.text,
        translation: translationVerse?.text || '',
        // Unfortunately, this API doesn't provide transliteration directly
        transliteration: '',
        // For audio, we'll use another source that follows a consistent pattern
        audio: `https://verses.quran.com/${surahNumber}/${verse.verse}.mp3`
      };
    });
    
    return {
      number: surahNumber,
      name: surahMetadata.arabicName || surahMetadata.name,
      englishName: surahMetadata.name,
      englishNameTranslation: surahMetadata.translation,
      numberOfAyahs: surahMetadata.verses,
      ayahs
    };
  } catch (error) {
    console.error(`Error fetching Surah ${surahNumber}:`, error);
    return null;
  }
};
