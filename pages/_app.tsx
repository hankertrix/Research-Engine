import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createContext, useState } from "react";

// The theme context type
export type ThemeContextType = {
  theme: string,
  toggleTheme: () => void
  themeClass: (style: any, cssClass: string) => string
}

// The theme context
export const ThemeContext = createContext<ThemeContextType | null>(null);

function MyApp({ Component, pageProps }: AppProps) {

  // The theme state for the application
  const [theme, setTheme] = useState("dark");

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme(current => current === "light" ? "dark" : "light");
  };

  // Function to append a theme to the back of the css class name for easy switching
  function themeClass(style: {readonly [key: string]: string;}, cssClass: string) {
    const themeSuffix = theme === "light" ? "-light" : "-dark";
    return style[cssClass + themeSuffix];
  }
  
  return (
    <ThemeContext.Provider value={{theme, toggleTheme, themeClass}}>
      <Component {...pageProps} />
    </ThemeContext.Provider>
  );
};

export default MyApp;
