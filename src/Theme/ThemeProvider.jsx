import React, { createContext, useState, useContext } from 'react';
import { lightTheme, darkTheme } from './theme';

const ThemeContext = createContext();

export const DarkLightThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(darkTheme);
  const [isToggleDark, setIsToggleDark] = useState(true);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === darkTheme ? lightTheme : darkTheme));
    setIsToggleDark(theme===darkTheme ? false: true)
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme,isToggleDark,darkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useDarkLightTheme = () => useContext(ThemeContext);
