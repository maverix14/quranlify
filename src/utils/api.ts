
import { Surah, Ayah } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';

// Get list of all Surahs (chapters)
export const getAllSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await fetch(`${BASE_URL}/surah`);
    if (!response.ok) throw new Error('Failed to fetch surahs');
    
    const data = await response.json();
    
    // Map the API response to our Surah type
    return data.data.map((surah: any) => ({
      number: surah.number,
      name: surah.name, // Arabic name
      englishName: surah.englishName,
      englishNameTranslation: surah.englishNameTranslation,
      numberOfAyahs: surah.numberOfAyahs,
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
    // Get Arabic text
    const arabicResponse = await fetch(`${BASE_URL}/quran/ar.alafasy`);
    if (!arabicResponse.ok) throw new Error('Failed to fetch Arabic text');
    
    const arabicData = await arabicResponse.json();
    
    // Get English translation
    const translationResponse = await fetch(`${BASE_URL}/quran/en.asad`);
    if (!translationResponse.ok) throw new Error('Failed to fetch translation');
    
    const translationData = await translationResponse.json();
    
    // Get surah metadata
    const surahResponse = await fetch(`${BASE_URL}/surah/${surahNumber}`);
    if (!surahResponse.ok) throw new Error('Failed to fetch surah metadata');
    
    const surahData = await surahResponse.json();
    const surahMetadata = surahData.data;
    
    // Extract ayahs for this surah
    const arabicAyahs = arabicData.data.surahs.find((s: any) => s.number === surahNumber)?.ayahs || [];
    const translationAyahs = translationData.data.surahs.find((s: any) => s.number === surahNumber)?.ayahs || [];
    
    // Construct the Surah object with ayahs
    const ayahs: Ayah[] = arabicAyahs.map((verse: any, index: number) => {
      const translationVerse = translationAyahs[index];
      
      return {
        number: verse.numberInSurah,
        text: verse.text,
        translation: translationVerse?.text || '',
        // Unfortunately, this API doesn't provide transliteration directly
        transliteration: '',
        // For audio, we'll use alafasy recitation which is widely available
        audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${verse.number}.mp3`
      };
    });
    
    return {
      number: surahNumber,
      name: surahMetadata.name,
      englishName: surahMetadata.englishName,
      englishNameTranslation: surahMetadata.englishNameTranslation,
      numberOfAyahs: surahMetadata.numberOfAyahs,
      ayahs
    };
  } catch (error) {
    console.error(`Error fetching Surah ${surahNumber}:`, error);
    return null;
  }
};
