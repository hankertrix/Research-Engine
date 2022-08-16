// The api page to receive a post request and return the search results

import type { NextApiRequest, NextApiResponse } from "next";
import { createSearchResults } from "../../data-processor/get-results";
import { removeMarkup, parseQuery } from "../../data-processor/utils";


// The data type
type Data = {
  status: string,
  message: string,
  searchTerm?: string,
  pageNumber?: number,
  data?: {
    title: string,
    sentences: string[],
    link: string
  }[]
}

// The invalid request message
const INVALID_REQ_MSG = `Request failed. The request to the API should be a GET request with a query string behind.

Example request url: https://research-engine.vercel.app/api/search?q=your+search+term&page=1&rich=true

Query parameters:
- q: Your URL encoded search term (required).
- page: The page number that you want (optional, defaults to 1).
- rich: Set it to "true" if you want html formatted text and "false" if you want plain text (optional, defaults to false).`;

// The function to return the actual data
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  // If the request is not a GET request or has no query string, returns a message to the user telling them the issue
  if (req.method !== 'GET' || !req.query.q) {
    return res.status(400).json({status: "400 Bad Request", message: INVALID_REQ_MSG});
  }

  // Gets the search term and the page number from the parsed query
  let [searchTerm, pageNumber] = parseQuery(req.query);

  // Force the variables into the type returned by the function because typescript somehow can't figure it out
  searchTerm = searchTerm as string;
  pageNumber = pageNumber as number;

  // If the search term is empty then return a message to the user saying that their request is empty
  if (searchTerm.length === 0) {
    return res.status(400).json({status: "400 Bad Request", message: "Your search term is empty."});
  }
    
  // Gets the rich text option from the query string
  const richText = req.query.rich === "true" ? true : false;

  console.time("createSearchResults");

  // Gets the data from the websites
  let data = await createSearchResults(searchTerm, pageNumber);

  console.timeEnd("createSearchResults");
  console.log("----------------------------");

  // Convert the data to one without markdown if the rich text isn't wanted
  if (!richText) data = removeMarkup(data);

  // Returns the data
  return res.status(200).json({status: "200 OK", message: "Request is successful!", searchTerm: searchTerm, pageNumber: pageNumber, data: data});
};