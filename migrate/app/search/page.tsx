// The page to display the results of a search

import { redirect } from "next/navigation";
import { parseQuery } from "../../data-processor/utils";
import SearchPage from "../../components/SearchPage";
import { createSearchResults } from "../../data-processor/get-results";

// The server component to return
export default async function ReturnSearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  
  // Gets the search term and the page number
  let [searchTerm, pageNumber] = parseQuery(searchParams);

  // If the search term is empty, redirects the user to the main page
  if (searchTerm.length === 0) return redirect("/");
  
  // Otherwise, search for the results
  const data = await createSearchResults(searchTerm, pageNumber);

  // Returns the search page
  return <SearchPage initialResults={data ?? []} searchTerm={searchTerm} pageNumber={pageNumber} />;
};
