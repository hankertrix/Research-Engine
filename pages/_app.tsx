import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

// The theme context type
export type ThemeContextType = {
  toggleTheme: () => void
  themeClass: (style: any, cssClass: string) => string
}

// The theme context
export const ThemeContext = createContext<ThemeContextType | null>(null);

function MyApp({ Component, pageProps }: AppProps) {

  // The router to use
  const router = useRouter();

  // The loading state
  const [loading, setLoading] = useState(true);

  // Function to set the loading state
  useEffect(() => {
    router.events.on("routeChangeStart", () => setLoading(true));
    router.events.on("routeChangeComplete", () => setLoading(false));
    router.events.on("routeChangeError", () => setLoading(false));
    return () => {
     router.events.off("routeChangeStart", () => setLoading(true));
    router.events.off("routeChangeComplete", () => setLoading(false));
    router.events.off("routeChangeError", () => setLoading(false)); 
    };
  }, [router.events]);

  // The theme state for the application
  const [theme, setTheme] = useState("light");

  // The function to check the user's system theme and the local storage for the theme and set the theme to their preference when the component is mounted
  useEffect(() => {

    // Set loading to false when the component is mounted
    setLoading(false);

    // Gets the media query for the user's system theme
    const themeMq = window.matchMedia("(prefers-color-scheme: dark)");

    // Gets the media query listener
    const mqListener = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
    
    // Gets the theme in the local storage
    let themeState: string | null = window.localStorage.getItem("theme");

    // If the theme can't be found
    if (themeState == null) {

      // Gets the theme from the user's system preferences
      themeState = themeMq.matches ? "dark" : "light";
    }

    // Sets the theme to the theme obtained from their system or the local storage
    setTheme(themeState);

    // Attach an event listener to the user's system theme
    themeMq.addEventListener("change", mqListener);
    
    // Returns the function to remove the event listener
    return () => themeMq.removeEventListener("change", mqListener);
  }, []);

  // Function to toggle the theme
  const toggleTheme = () => {

    // Gets the new theme
    const newTheme = theme === "light" ? "dark" : "light";

    // Set the new theme
    setTheme(newTheme);

    // Saves the new theme to local storage if the window is defined
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", newTheme);
    }
  };

  // Function to append a theme to the back of the css class name for easy switching
  function themeClass(style: {readonly [key: string]: string;}, cssClass: string) {
    const themeSuffix = theme === "light" ? "-light" : "-dark";
    return style[cssClass + themeSuffix];
  }
  
  return (
    <div>
    {loading ? (<div></div>) : (
      <ThemeContext.Provider value={{toggleTheme, themeClass}}>
        <Component {...pageProps} />
      </ThemeContext.Provider>
    )}
    </div>
  );
};

export default MyApp;
