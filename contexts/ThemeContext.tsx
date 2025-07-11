import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryDark: string;
  accent: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  overlay: string;
}

const lightTheme: ThemeColors = {
  background: '#FFFFFF', // pure white
  surface: '#F5F5F5', // lighter surface for chips
  surfaceElevated: '#FFFFFF',
  text: '#181818', // Spotify dark text
  textSecondary: '#535353',
  textMuted: '#B3B3B3',
  primary: '#1DB954', // Spotify green
  primaryDark: '#169443',
  accent: '#1ED760',
  border: '#E5E7EB',
  success: '#1DB954',
  warning: '#F59E0B',
  error: '#EF4444',
  overlay: 'rgba(0, 0, 0, 0.08)'
};

const darkTheme: ThemeColors = {
  background: '#000000', // true black
  surface: '#181818', // Spotify dark surface
  surfaceElevated: '#222326', // Spotify dark elevated
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textMuted: '#535353',
  primary: '#1DB954', // Spotify green
  primaryDark: '#169443',
  accent: '#1ED760',
  border: '#282828',
  success: '#1DB954',
  warning: '#F59E0B',
  error: '#EF4444',
  overlay: 'rgba(0, 0, 0, 0.7)'
};

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};