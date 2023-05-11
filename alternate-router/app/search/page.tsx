// The page to display the results of a search

import { redirect, useRouter } from "next/navigation";
import { parseQuery } from "../../data-processor/utils";
import SearchPage from "../../components/SearchPage";
import { createSearchResults } from "../../data-processor/get-results";

// Function to generate a query string from the search params 
function generateQueryStringFromSearchParams(searchParams: { [key: string]: string | string[] | undefined }) {

  // The list containing the final query string
  const queryStringList: string[] = [];

  // Iterates all the items in the searchParams object
  for (const [key, value] of Object.entries(searchParams)) {

    // Adds the key and the value to the string list separated by an "=" sign
    queryStringList.push(`${key}=${Array.isArray(value) ? value.join("") : value}`);
  }

  // Returns the query string, which is the query string joined with an "&" with a "?" in front
  return `?${queryStringList.join("&")}`;
}

// The server component to return
export default async function ReturnSearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {

  // Gets the search term and the page number
  let [searchTerm, pageNumber] = parseQuery(
    generateQueryStringFromSearchParams(searchParams)
  );

  // If the search term is empty, redirects the user to the main page
  if (searchTerm.length === 0) return redirect("/");
  
  // Otherwise, search for the results
  const data = await createSearchResults(searchTerm, pageNumber);

  // Gets the router
  const router = useRouter();

  // Returns the search page
  return <SearchPage initialResults={data ?? []} searchTerm={searchTerm} pageNumber={pageNumber} router={router} />;
};
