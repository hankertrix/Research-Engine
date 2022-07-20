// The page to display the results of a search

import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SearchBar from "../components/SearchBar";
import { parseQuery } from "../data-processor/utils";

// The results page
const Results: NextPage = () => {

  // // Gets the router object
  // const router = useRouter();

  // // Gets the query parameters from the page
  // const parsedQuery = parseQuery(router.query);

  // // Gets the search term and page number
  // const searchTerm = parsedQuery.q;
  // const pageNumber = parsedQuery.page;

  // // If the search term is empty, redirects the user to the main page
  // if (searchTerm.length === 0) useEffect(() => {
  //   router.push("/");
  // }, []);
  
  return (
    <div>
    <Head>
      <title>{` - Research Engine`}</title>
    </Head>
    <SearchBar page={1}/>
    </div>
  );
};

export default Results;