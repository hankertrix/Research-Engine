// The page to display the results of a search

import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useState, useContext, useRef, MouseEvent, CSSProperties } from "react";
import SearchBar from "../components/SearchBar";
import PageSelector from "../components/PageSelector";
import ArrowButton from "../components/ArrowButton";
import Footer from "../components/Footer";
import { parseQuery } from "../data-processor/utils";
import type { Result } from "../components/ResultPage";
import ResultPage from "../components/ResultPage";
import { createSearchResults } from "../data-processor/get-results";
import { ThemeContext, ThemeContextType } from "./_app";
import styles from "../styles/SearchPage.module.css";

// The results page
const Results: NextPage<{initialResults: Result[], searchTerm: string, pageNumber: number}> = ({ initialResults, searchTerm, pageNumber }) => {

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


  // Creates a new intersection observer
  useEffect(() => {

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
        <SearchBar query={searchTerm} />

        {/* The wrapper to wrap the whole content of the page */}
        <div className={styles.wrapper}>
  
          {/* Display the no results message when there is no results */}
          {initialResults.length === 0 ? <main className={styles["no-results"]}>No results were found.</main> : 
            
            <>
  
              {/* Otherwise, show the results with the load more button and the page selector */}

              {/* The search results */}
              <main className={`${styles.main} ${themeClass(styles, "main")}`}>
                {splitResults(results, 10).map((data, page) => <ResultPage key={page + 1} results={data} page={page + 1} observer={pageObserver.current} />)}
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
                <PageSelector key={currentPage} page={currentPage} />
              </div>
            </>
          }
        
        </div>

        {/* The divider to space the page from the footer */}
        <div className={styles.spacer}></div>
        
        {/* The footer element */}
        <Footer style={footerStyles} />

        {/* The scroll back to the top button */}
        <a className={styles["top-button"]} href="#top" title="Go to the top"><ArrowButton style={{transform: "rotateZ(-90deg)"}} /></a>
      
      </div>
    </>
  );
};


// The function to get the results for the search term
export const getServerSideProps: GetServerSideProps = async ({ query }) => {

  // Gets the search term and the page number
  let [searchTerm, pageNumber] = parseQuery(query);

  // Type the search term and page number correctly
  searchTerm = searchTerm as string;
  pageNumber = pageNumber as number;

  // If the search term is empty, redirects the user to the main page
  if (searchTerm.length === 0) return {redirect: {destination: "/", permanent: false}};

  // Otherwise, search for the results
  const data = await createSearchResults(searchTerm, pageNumber);

  // Pass the data to the page
  return {props: { initialResults: data ?? [], searchTerm: searchTerm, pageNumber: pageNumber}};
};

export default Results;