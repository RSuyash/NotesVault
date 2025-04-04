import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

// Create the context with a default value (can be undefined or a default object)
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize state from localStorage or default to 'light'
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('notesVaultTheme') as Theme | null;
    // You could also check system preference here if desired:
    // const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return storedTheme || 'light'; // Default to light
  });

  useEffect(() => {
    // Apply the class to the body element
    const body = document.body;
    body.classList.remove('light-mode', 'dark-mode'); // Remove any existing class
    body.classList.add(`${theme}-mode`); // Add the current theme class

    // Save theme to localStorage
    localStorage.setItem('notesVaultTheme', theme);
  }, [theme]); // Re-run effect when theme changes

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};