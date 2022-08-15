import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import LoadingPage from "../components/LoadingPage";

// The theme context type
export type ThemeContextType = {
  theme: string,
  toggleTheme: () => void,
  themeClass: (style: { readonly [key: string]: string;}, cssClass: string) => string
}

// The theme context
export const ThemeContext = createContext<ThemeContextType | null>(null);

function MyApp({ Component, pageProps }: AppProps) {

  // The router to use
  const router = useRouter();

  // The initial load state
  const [isInitialLoad, setInitialLoad] = useState(true);

  // The loading state
  const [researching, setResearching] = useState(false);

  // The regular expression to check if the URL is a search page
  const searchPageRegex = /\/search\?(?:q=\S+|page=\d+&q=\S+)$/

  // Function to handle the route starts to change
  function handleRouteStart(url: string) {

    // If the url is the main search page, set the state to researching
    if (searchPageRegex.test(url) && !url.includes("api")) setResearching(true);

    // Set researching to false otherwise
    setResearching(false);
  }

  // Function to set the loading state
  useEffect(() => {
    router.events.on("routeChangeStart", () => handleRouteStart(router.asPath));
    router.events.on("routeChangeComplete", () => setResearching(false));
    router.events.on("routeChangeError", () => setResearching(false));
    return () => {
      router.events.off("routeChangeStart", () => handleRouteStart(router.asPath));
      router.events.off("routeChangeComplete", () => setResearching(false));
      router.events.off("routeChangeError", () => setResearching(false));
    };
  }, [router.events]);

  // The theme state for the application
  const [theme, setTheme] = useState("light");

  // The function to check the user's system theme and the local storage for the theme and set the theme to their preference when the component is mounted
  useEffect(() => {

    // Sets the initial load to false
    setInitialLoad(false);

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
    <ThemeContext.Provider value={{theme, toggleTheme, themeClass}}>
      {(researching || isInitialLoad) ? (<LoadingPage text="Researching..." isInitialLoad={isInitialLoad}/>) : (<Component {...pageProps} />)}
    </ThemeContext.Provider>
  );
};

export default MyApp;
