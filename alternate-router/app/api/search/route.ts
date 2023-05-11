// The api page to receive a post request and return the search results

import { NextRequest, NextResponse } from "next/server";
import { createSearchResults } from "../../../data-processor/get-results";
import { removeMarkup, parseQuery } from "../../../data-processor/utils";


// The data type
export type Data = {
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

// The function to return the actual data
export async function GET(req: NextRequest) {

  // Gets the search term and the page number from the parsed query
  let [searchTerm, pageNumber] = parseQuery(req.nextUrl.searchParams);

  // If the search term is empty then return a message to the user saying that their request is empty
  if (searchTerm.length === 0) {
    return NextResponse.json({status: "400 Bad Request", message: "Your search term is empty."});
  }
    
  // Gets the rich text option from the query string
  const richText = req.nextUrl.searchParams.get("rich") === "true" ? true : false;

  // console.time("createSearchResults");

  // Gets the data from the websites
  let data = await createSearchResults(searchTerm, pageNumber);

  // console.timeEnd("createSearchResults");
  // console.log("----------------------------");

  // Convert the data to one without markdown if the rich text isn't wanted
  if (!richText) data = removeMarkup(data);

  // Returns the data
  return NextResponse.json({status: "200 OK", message: "Request is successful!", searchTerm: searchTerm, pageNumber: pageNumber, data: data});
};