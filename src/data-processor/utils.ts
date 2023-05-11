// The module containing all the utility functions

import { REMOVE_MARKING_TAG_REGEX } from "./get-results";

// Removes the markup from the sentences in the list of website objects
export function removeMarkup(websiteObjList: {title: string, sentences: string[], link: string}[]) {

  // Iterates the website object list
  for (const website of websiteObjList) {

    // Iterates the list of sentences in the object
    for (let i = 0; i < website.sentences.length; ++i) {

      // Gets the sentence
      const sentence = website.sentences[i];

      // Sets the sentence in the list to the one with the markdown removed
      website.sentences[i] = sentence.replace(REMOVE_MARKING_TAG_REGEX, "");
    }
  }

  // Returns the new website object list
  return websiteObjList;
}


// Function to get the search parameters of the URL
export function getSearchParams(url: string): URLSearchParams {

  // Removes everything before a question mark
  url = url.replace(/^.*?\?/, "?");

  // Returns the search parameters
  return new URLSearchParams(url);
}


// Function to parse a query
export function parseQuery(query: string | URLSearchParams): [string, number] {

  // If the query given is a string, convert it into a URLSearchParams object
  if (typeof query === "string") query = getSearchParams(query);
  
  // If the query object doesn't have the search term, immediately return an empty string and a page number of 1
  if (!query.get("q")) return ["", 1];

  // Gets the search term
  const searchTerm = query.get("q")!.trim();

  // Initialise the page number variable
  let pageNum = "";

  // Checks if the page number exists
  if (query.get("page")) {

    // Set the page number to it
    pageNum = query.get("page")!.trim();

    // If the page number isn't a valid number, change it to 1
    if (!/^\d+$/.test(pageNum)) pageNum = "1";
  }

  // If the page number doesn't exist
  else {

    // Change the page number to 1
    pageNum = "1";
  }

  // Gets the page number as a number
  const pageNumber = parseInt(pageNum) < 1 ? 1 : parseInt(pageNum);

  // Returns an object containing the query string and the page number
  return [searchTerm, pageNumber];
}