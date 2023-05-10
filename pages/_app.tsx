import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ThemeContextProvider } from "../components/ThemeContextProvider";
import LoadingPage from "../components/LoadingPage";

// The theme context type
export type ThemeContextType = {
  theme: string,
  toggleTheme: () => void,
  themeClass: (style: { readonly [key: string]: string;}, cssClass: string) => string,
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

  // Function to set the loading state
  useEffect(() => {

    // The regular expression to check if the URL is a search page
    const searchPageRegex = /\/search\?(?:q=\S+|page=\d+&q=\S+)$/;
    
    // Function to handle the route starts to change
    function handleRouteStart(url: string) {
  
      // If the url is the main search page, set the state to researching
      if (searchPageRegex.test(url) && !url.includes("api")) setResearching(true);
    }
  
    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", () => setResearching(false));
    router.events.on("routeChangeError", () => setResearching(false));
    return () => {
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", () => setResearching(false));
      router.events.off("routeChangeError", () => setResearching(false));
    };
  }, [router.events]);

  // The function to set the initial load to false when the app is starting to load
  useEffect(() => {

    // Sets the initial load to false
    setInitialLoad(false);
  }, []);
  
  return (
    <ThemeContextProvider>
      {(researching || isInitialLoad) ? (<LoadingPage text={isInitialLoad ? "Loading" : "Researching"} isInitialLoad={isInitialLoad} />) : (<Component {...pageProps} />)}
    </ThemeContextProvider>
  );
};

export default MyApp;
