"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the type for the theme context state
interface ThemeContextState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextState>({
  darkMode: false,
  toggleDarkMode: () => { },
});

// Create a provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("darkMode");
    if (storedTheme !== null) {
      setDarkMode(storedTheme === "true");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode, mounted]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);
