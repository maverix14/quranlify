
import { ReadingProgress, AppSettings } from "../types";

const PROGRESS_KEY = "quran-progress";
const SETTINGS_KEY = "quran-settings";

// Default settings
const defaultSettings: AppSettings = {
  autoPlayAudio: false,
  showTranslation: true,
  showTransliteration: false,
  fontSize: 1, // 1 is normal, can be 0.75, 1, 1.25, 1.5
};

// Default progress (start at Surah 1, Ayah 1)
const defaultProgress: ReadingProgress = {
  surahNumber: 1,
  ayahNumber: 1,
  lastRead: new Date().toISOString(),
};

// Get reading progress from local storage
export const getProgress = (): ReadingProgress => {
  try {
    const progress = localStorage.getItem(PROGRESS_KEY);
    return progress ? JSON.parse(progress) : defaultProgress;
  } catch (error) {
    console.error("Error getting progress:", error);
    return defaultProgress;
  }
};

// Save reading progress to local storage
export const saveProgress = (progress: ReadingProgress): void => {
  try {
    progress.lastRead = new Date().toISOString();
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Error saving progress:", error);
  }
};

// Get app settings from local storage
export const getSettings = (): AppSettings => {
  try {
    const settings = localStorage.getItem(SETTINGS_KEY);
    return settings ? JSON.parse(settings) : defaultSettings;
  } catch (error) {
    console.error("Error getting settings:", error);
    return defaultSettings;
  }
};

// Save app settings to local storage
export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};
