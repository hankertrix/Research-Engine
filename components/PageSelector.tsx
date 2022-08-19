// The page selector for the search results page

import type { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { useContext } from "react";
import { ThemeContext, ThemeContextType } from "../pages/_app";
import styles from "../styles/PageSelector.module.css";
import ArrowButton from "./ArrowButton";

// The page selector
const PageSelector: NextPage = () => {

  // Gets the themeClass function
  const { themeClass } = useContext(ThemeContext) as ThemeContextType;

  // Gets the router
  const router = useRouter();
  
  
  // Function to parse the page number
  function parsePageNum(page: string | string[] | undefined) {
    
    // Checks if the page number exists
    if (page) {
  
      // Set the page number to it
      page = Array.isArray(page) ? page.join("").trim() : page.trim();
  
      // If the page number isn't a valid number, change it to 1
      if (!/^\d+$/.test(page)) page = "1";
    }
  
    // If the page number doesn't exist
    else {
  
      // Change the page number to 1
      page = "1";
    }
  
    // Gets the page number as a number
    return parseInt(page) < 1 ? 1 : parseInt(page);
  }
  
  
  // Function to render the page selector
  function renderPageSelector(page: number) {

    // The list of elements to render
    const elemList = [];

    // Create the relative url
    const relativeUrl = `/search?q=${router.query.q ?? ""}&page=`;

    // If the page number is more than 1, adds the previous arrow button at the front
    if (page > 1) elemList.push(
      <Link href={`${relativeUrl}${page - 1}`}>
        <a className={styles["arrow-button"]} title="Previous Page">
          <ArrowButton style={{transform: "scale(-1, 1)"}} />
        </a>
      </Link>
    );

    // Otherwise add an empty div to fill up the space
    else elemList.push(
      <div className={styles.empty}></div>
    );

    // Gets the starting page
    const startPage = page - 5 < 1 ? 1 : page - 5;

    // Gets the last page
    const lastPage = page < 7 ? 11 : page + 5;

    // Iterates from the starting page to the last page
    for (let i = startPage; i < lastPage; ++i) {

      // If the page is the same as the current page, make it display normally instead of a link
      if (i === page) elemList.push(<div className={styles["page-button"]}>{i}</div>);

      // Otherwise, adds the page button to the list
      else elemList.push(
        <Link href={`${relativeUrl}${i}`}>
          <a className={styles["page-button"]} title={`Go to page ${i}`}>{i}</a>
        </Link>
      );
    }

    // Adds the next arrow button at the back
    elemList.push(
      <Link href={`${relativeUrl}${page + 1}`}>
        <a className={styles["arrow-button"]} title="Next Page">
          <ArrowButton />
        </a>
      </Link>
    );

    // Returns the list of elements to render
    return elemList;
  }

  
  return (
    <div className={`${styles.selector} ${themeClass(styles, "selector")}`}>
      {renderPageSelector(parsePageNum(router.query.page))}
    </div>
  );
};

export default PageSelector;