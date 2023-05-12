// The page to display the results of a search

// Mark this as a client component
"use client";

import type { NextPage } from "next";
import type { useRouter } from "../types";
import Head from "next/head";
import { useEffect, useState, useContext, useRef, MouseEvent, CSSProperties } from "react";
import SearchBar from "./SearchBar";
import PageSelector from "./PageSelector";
import ArrowButton from "./ArrowButton";
import Footer from "./Footer";
import type { Result } from "./ResultPage";
import ResultPage from "./ResultPage";
import { ThemeContext, ThemeContextType } from "./ThemeContextProvider";
import styles from "../styles/SearchPage.module.css";

// The search page
const SearchPage: NextPage<{initialResults: Result[], searchTerm: string, pageNumber: number, useRouter: useRouter}> = ({ initialResults, searchTerm, pageNumber, useRouter }) => {

  // Gets the themeClass function
  const { themeClass } = useContext(ThemeContext) as ThemeContextType;

  // Gets the current page as a state
  const [currentPage, setPage] = useState<number>(pageNumber);

  // Gets the results as a state
  const [results, updateResults] = useState(initialResults);

  // Gets the button disabled property as a state
  const [disabled, setDisabled] = useState(false);

  // Gets the state of the loader
  const [loaderVisible, setLoaderVisible] = useState(false);

  // Gets a reference to the intersection observer to observe the results page
  const pageObserver = useRef<IntersectionObserver | null>(null);

  // The scroll up button
  const scrollUpBtn = useRef<HTMLAnchorElement | null>(null);


  // Adds an event listener on the scroll event and create a new intersection observer
  useEffect(() => {

    // The function to handle the scroll event
    function handleScroll() {
      
      // Checks if the scroll position is more than 200px downwards
      if (window.scrollY >= 200) {

        // Makes the scroll up button visible
        scrollUpBtn.current!.style.opacity = "1";
      }

      // If the scroll position is less than 200
      else {

        // Makes the scroll up button invisible
        scrollUpBtn.current!.style.opacity = "0";
      }
    }

    // Adds an event listener for the scroll event
    document.addEventListener("scroll", handleScroll);

    // The callback function for the intersection observer
    const checkOnScreen: IntersectionObserverCallback = (entries) => {
      
      // Iterates the list of entries
      for (const entry of entries) {

        // Gets the page number
        const page = (entry.target as HTMLElement).dataset.page;

        // Gets the query object
        const query = new URLSearchParams(window.location.search);

        // Checks if the page is visible on screen and is in the url
        if (entry.isIntersecting && query.has("page")) {

          // Updates the current page
          setPage(parseInt(page ?? "1"));
          
          // Replaces the current url with the new one
          window.history.replaceState({page: page}, `${query.get("q")} - Research Engine`, `/search?q=${query.get("q")}&page=${page}`);
        }

        // Otherwise, if the element is intersecting
        else if (entry.isIntersecting) {
          
          // Updates the current page
          setPage(parseInt(page ?? "1"));

          // Replaces the url with the new one
          window.history.replaceState({page: page}, `${query.get("q")} - Research Engine`, `/search?q=${query.get("q")}&page=${page}`);
        }
      };
    }

    // Creating a new intersection observer
    const observer = new IntersectionObserver(checkOnScreen, {threshold: 0.05});

    // Sets the page observer reference to the current observer
    pageObserver.current = observer;

    // Returns a function to remove the scroll event listener on the page
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  
  // Function to break the results into arrays of N results
  function splitResults(results: Result[], chunkSize: number) {

    // The final array containing each chunk
    const chunks = [];

    // Iterates the array in chunks
    for (let i = 0; i < results.length; i += chunkSize) {

      // Adds the chunk to the list
      chunks.push(results.slice(i, i + chunkSize));
    }

    // Returns the results split into chunks
    return chunks;
  }


  // Function to handle the load more button
  async function loadMore(e: MouseEvent<HTMLButtonElement>) {

    // Prevent the default behaviour
    e.preventDefault();

    // Disables the button
    setDisabled(true);

    // Displays the loading spinner
    setLoaderVisible(true);

    // Requests the next page of results from the api and gets the response
    const res = await fetch(`/api/search?q=${searchTerm}&page=${currentPage + 1}&rich=true`);

    // Gets the json data from the api
    const results = await res.json();

    // If the results are not empty
    if (results.data.length !== 0) {

      // Update the results with the new ones
      updateResults(oldData => Array.from(new Set(oldData.concat(results.data))));

      // Stop displaying the loading spinner
      setLoaderVisible(false);
      
      // Re-enable the button
      setDisabled(false);
    }

    // If there are no results
    else {

      // Gets the button
      const btn = e.target as HTMLButtonElement;

      // Sets the inner HTML of the button to show that there are no more results
      btn.innerHTML = "There are no more search results.";
    }
  }


  // Styles for the load more button
  const buttonStyles = {
    boxShadow: loaderVisible ? "none" : undefined,
    background: loaderVisible ? "none" : undefined,
    backgroundColor: loaderVisible ? "none" : undefined,
    "--loading-spinner-display": loaderVisible ? "inline-block" : "none",
    "--text-display": loaderVisible ? "none" : "block",
  } as CSSProperties;


  // The footer styles
  const footerStyles = {
    width: "100%",
    "--source-right-margin-normal": "67px",
    "--source-right-margin-700": "40px",
    "--source-right-margin-400": "29px"
  } as CSSProperties;

  
  return (
    <>

      {/* Meta information */}
      <Head>
        <title>{`${searchTerm} - Research Engine`}</title>
        <meta name="description" content={`Page ${pageNumber} of search results for "${searchTerm}".`} />
      </Head>
      
      {/* The wrapper element to wrap the page */}
      <div className={`${styles["page-wrapper"]} ${themeClass(styles, "page-wrapper")}`}>

        {/* The top of the page */}
        <div id="top"></div>

        {/* The search bar at the top */}
        <SearchBar query={searchTerm} useRouter={useRouter} />

        {/* The wrapper to wrap the whole content of the page */}
        <div className={styles.wrapper}>
  
          {/* Display the no results message when there is no results */}
          {initialResults.length === 0 ? <main className={styles["no-results"]}>No results were found.</main> : 
            
            <>
  
              {/* Otherwise, show the results with the load more button and the page selector */}

              {/* The search results */}
              <main className={`${styles.main} ${themeClass(styles, "main")}`}>
                {splitResults(results, 10).map((data, page) => <ResultPage key={pageNumber + page} results={data} page={pageNumber + page} observer={pageObserver.current} />)}
              </main>
      
              {/* The load more button */}
              <button
                disabled={disabled}
                className={styles.btn}
                onClick={loadMore}
                style={buttonStyles}>
  
                    {/* The text on the button */}
                    <div className={styles["text-display"]}>Load More</div>
      
                    {/* The loading spinner */}
                    <div className={styles["lds-spinner"]}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              </button>
      
              {/* The page selector */}
              <div className={styles["page-selector"]}>
                <PageSelector key={currentPage} page={currentPage} searchTerm={searchTerm} />
              </div>
            </>
          }
        
        </div>

        {/* The divider to space the page from the footer */}
        <div className={styles.spacer}></div>
        
        {/* The footer element */}
        <Footer style={footerStyles} />

        {/* The scroll back to the top button */}
        <a className={styles["top-button"]} href="#top" title="Go to the top" ref={scrollUpBtn}><ArrowButton style={{transform: "rotateZ(-90deg)"}} /></a>
      
      </div>
    </>
  );
};

export default SearchPage;