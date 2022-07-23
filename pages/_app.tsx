import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createContext, useState, useEffect } from "react";

// The theme context type
export type ThemeContextType = {
  toggleTheme: () => void
  themeClass: (style: any, cssClass: string) => string
}

// The theme context
export const ThemeContext = createContext<ThemeContextType | null>(null);

function MyApp({ Component, pageProps }: AppProps) {

  // The theme state for the application
  const [theme, setTheme] = useState("light");

  // The function to check the user's system theme and the local storage for the theme and set the theme to their preference
  useEffect(() => {

    // Gets the media query for the user's system theme
    const themeMq = window.matchMedia("(prefers-color-scheme: dark)");

    // Gets the media query listener
    const mqListener = e => setTheme(e.matches ? "dark" : "light");

    // Attach an event listener to the user's system theme
    themeMq.addEventListener("change", mqListener);
    
    // Gets the theme in the local storage
    let themeState: string | null = window.localStorage.getItem("theme");

    // If the theme can't be found
    if (themeState == null) {

      // Gets the theme from the user's system preferences
      themeState = themeMq.matches ? "dark" : "light";
    }

    // Sets the theme to the theme obtained from their system or the local storage
    setTheme(themeState);

    // Returns the function to remove the event listener
    return () => themeMq.removeEventListener("change", mqListener);
  }, [])

  // The function to save the state to the local storage when the theme changes
  useEffect(() => window.localStorage.setItem("theme", theme), [theme]);

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
    <ThemeContext.Provider value={{toggleTheme, themeClass}}>
      <Component {...pageProps} />
    </ThemeContext.Provider>
  );
};

export default MyApp;
