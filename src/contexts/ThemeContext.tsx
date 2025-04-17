import React, { createContext, useContext, useEffect, useState } from 'react';
// IMPORTANT: Remove this import - it's causing the error
// import { storage } from '../utils/storage';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      // Use localStorage directly instead of the storage import
      const savedTheme = localStorage.getItem('theme');
      return (savedTheme as Theme) || 'light';
    } catch (error) {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      // Use localStorage directly 
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
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
