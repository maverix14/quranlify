import React, { createContext, useContext, useEffect, useState } from 'react';
// Import the specific functions we need instead of "storage"
import { getSettings, saveSettings } from '../utils/storage';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // We need to modify this to use the existing storage functions
    try {
      // Option 1: Use existing settings if your AppSettings has a theme property
      const settings = getSettings();
      if (settings && 'theme' in settings) {
        return settings.theme as Theme;
      }
      
      // Option 2: Or use localStorage directly if theme is stored separately
      const savedTheme = localStorage.getItem('theme');
      return (savedTheme as Theme) || 'light';
    } catch (error) {
      return 'light';
    }
  });

  useEffect(() => {
    // Save the theme preference
    try {
      // Option 1: Modify this if your AppSettings has a theme property
      // const settings = getSettings();
      // saveSettings({ ...settings, theme });
      
      // Option 2: Or use localStorage directly if theme should be separate
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
    
    // Update the document classes for dark mode
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
