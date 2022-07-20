// The page to display the results of a search

import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import SearchBar from "../components/SearchBar";
import { parseQuery } from "../data-processor/utils";

// The results page
const Results: NextPage = () => {

  // // Gets the router object
  // const router = useRouter();

  // // Gets the search term and the page number from the parsed query
  // const [searchTerm, pageNumber] = parseQuery(req.query);

  // // If the search term is empty, redirects the user to the main page
  // if (searchTerm.length === 0) useEffect(() => {
  //   router.push("/");
  // }, []);
  
  return (
    <div>
    <Head>
      <title>{` - Research Engine`}</title>
    </Head>
      <div></div>
    <SearchBar page={1}/>
     
    </div>
  );
};

export default Results;