// The page to display the results of a search

import type { NextPage, GetServerSideProps } from "next";
import type { Result } from "../components/ResultPage";
import { parseQuery } from "../data-processor/utils";
import SearchPage from "../components/SearchPage";
import { createSearchResults } from "../data-processor/get-results";

// The results page
const Results: NextPage<{initialResults: Result[], searchTerm: string, pageNumber: number}> = ({ initialResults, searchTerm, pageNumber }) => {

  // Returns the search page
  return <SearchPage initialResults={initialResults} searchTerm={searchTerm} pageNumber={pageNumber} />;
};


// The function to get the results for the search term
export const getServerSideProps: GetServerSideProps = async ({ req }) => {

  // Gets the search parameters from the query
  const { searchParams } = new URL(req.url);

  // Gets the search term and the page number
  let [searchTerm, pageNumber] = parseQuery(searchParams);

  // If the search term is empty, redirects the user to the main page
  if (searchTerm.length === 0) return {redirect: {destination: "/", permanent: false}};

  // Otherwise, search for the results
  const data = await createSearchResults(searchTerm, pageNumber);

  // Pass the data to the page
  return {props: { initialResults: data ?? [], searchTerm: searchTerm, pageNumber: pageNumber}};
};

export default Results;