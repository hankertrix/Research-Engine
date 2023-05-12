// The wrapper for the search page so the router can be passed to the search page in the app router

// Mark this as a client component
"use client";

import type { NextPage } from "next";
import type { Result } from "./ResultPage";
import { useRouter } from "next/navigation";
import SearchPage from "./SearchPage";

// The search page wrapper
const SearchPageWrapper: NextPage<{initialResults: Result[], searchTerm: string, pageNumber: number}> = ({ initialResults, searchTerm, pageNumber }) => {

  // Returns the search page with the use router function passed
  return (<SearchPage initialResults={initialResults} searchTerm={searchTerm} pageNumber={pageNumber} useRouter={useRouter} />);
}

export default SearchPageWrapper;