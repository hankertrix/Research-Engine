// The api page to receive a post request and return the search results

import type { NextApiRequest, NextApiResponse } from 'next'
import { createSearchResults, removeMarkup } from '../../data-processor/get-results'

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
const INVALID_REQ_MSG = `The request to the API should be a GET request with a query string behind.

Example request url: https://research-engine.vercel.app/api/search?searchTerm=your+search+term&pageNum=1&richText=true

Query parameters:
- searchTerm: Your URL encoded search term (required).
- pageNum: The page number that you want (optional, defaults to 1).
- richText: Set it to "true" if you want html formatted text and "false" if you want plain text (optional, defaults to false).`;

// The function to return the actual data
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  // If the request is not a GET request or has no query string, returns a message to the user telling them the issue
  if (req.method !== 'GET' || !req.query.searchTerm) {
    res.status(400).json({status: "400 Bad Request", message: INVALID_REQ_MSG})
  }

  // Otherwise parse the query string
  else {

    // Gets the search term from the query string
    const searchTerm = Array.isArray(req.query.searchTerm) ? req.query.searchTerm.join(" ") : req.query.searchTerm;

    // Initialise the page number variable
    let pageNum = "";

    // Checks if the page number exists
    if (req.query.pageNum) {

      // Set the page number to it
      pageNum = Array.isArray(req.query.pageNum) ? req.query.pageNum.join("") : req.query.pageNum;

      // If the page number isn't a valid number, change it to 1
      if (!/^\d+$/g.test(pageNum)) pageNum = "1";
    }

    // If the page number doesn't exist
    else {

      // Change the page number to 1
      pageNum = "1";
    }

    // Gets the page number as a number
    const pageNumber = parseInt(pageNum) <= 0 ? 1 : parseInt(pageNum);

    // Gets the rich text option from the query string
    const richText = req.query.richText === "true" ? true : false;

    console.time("createSearchResults");

    // Gets the data from the websites
    let data = await createSearchResults(searchTerm, pageNumber);

    console.timeEnd("createSearchResults");

    // Convert the data to one without markdown if the rich text isn't wanted
    if (!richText) data = removeMarkup(data);

    // Returns the data
    res.status(200).json({status: "200 OK", message: "Request is successful!", searchTerm: searchTerm, pageNumber: parseInt(pageNum), data: data});
  }
}