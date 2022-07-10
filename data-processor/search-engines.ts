// Module that contains the search engine classes

import { parse } from 'node-html-parser';

// Regular expression to get a website's hostname
export const HOST_NAME_REGEX = /https?:\/\/.*?(?=\/)/g;

// The headers to use for every GET request
export const HEADERS = {
  "Accept" : "text/html",
  "Accept-Language": "en-US,en;q=0.9",
  "DNT" : "1",
  "Referer" : "https://www.google.com",
  "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36"
}

// Abstract base class for to represent a search engine
export class SearchEngine {

  searchTerm: string;
  pageNum: number;
  numOfResults: number = 10;
  url: string;
  response: string | any;

  constructor(searchTerm: string, websitePageNumber: number) {

    // Throws an error if the class is instantiated
    if (this.constructor == SearchEngine) {
      throw new Error("Abstract classes can't be instantiated.");
    }

    // Initialise the object
    else {

      // Change all the spaces in the search term into pluses
      let encodedSearchTerm = searchTerm.replace(" ", "+");

      // Sets the properties of the object
      this.searchTerm = encodedSearchTerm;
      this.pageNum = websitePageNumber;
      this.url = "";
      this.response = "";
    }
  }

  // Function to make the request
  makeRequest() {
    const request = {
      "url" : this.url,
      "method" : "GET",
      "redirect" : "follow",
      "headers" : HEADERS
    }

    // Returns the request object
    return request;
  }

  // Function to set the response
  async setResponse(response: Response) {
    this.response = await response.text();
  }

  // Function to parse the returned response
  parse() {
    throw new Error("parse() is not implemented");
  }
}


// The class for ERIC
export class ERIC extends SearchEngine {

  numOfResults = 15;

  constructor(searchTerm: string, websitePageNumber: number) {
    
    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.url = `https://eric.ed.gov/?q=${this.searchTerm}&pg=${this.pageNum}`;
  }

  // Function to parse the DOM of the HTML and return the list of links
  parse() {

    // Calls the general parser function and returns the result
    return parseSearchEngineResults(this.url, this.response as string, '#rrw a[title]:not(a[title$=".pdf"])', "title", false);
  }
}


// The class for CORE
export class CORE extends SearchEngine {

  numOfResults = 10;

  constructor(searchTerm: string, websitePageNumber: number) {
    
    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.url = `https://api.core.ac.uk/v3/search/works/?api_key=${process.env.CORE_KEY}&q=${this.searchTerm}&offset=${(this.pageNum - 1) * this.numOfResults}&limit=${this.numOfResults}`;
  }

  // Function to make the request object
  makeRequest() {
    const request = {
      "url" : this.url,
      "method" : "GET",
      "redirect" : "follow",
      "headers" : {
        "Accept" : "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type" : "application/json",
        "DNT" : "1",
        "Referer" : "https://www.google.com",
        "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36"
      }
    }

    // Returns the request object
    return request;
  }
  

  // Function to make response for the object
  async setResponse(response: Response) {
    this.response = await response.json();
  }

  // Function to parse the response and return the list of links
  parse() {

    // The list of websites
    const websiteList = [];

    // Iterates the list of results
    for (const result of this.response.results) {

      // Builds a url from the id
      const url = `https://core.ac.uk/works/${result.id}`;

      // Adds website object to the list of urls
      websiteList.push({"url": url, "title" : result.title, "text": result.abstract});
    }

    // Returns the list of website objects
    return websiteList;
  }
}


// The class for Semantic Scholar
export class SemanticScholar extends SearchEngine {

  numOfResults = 10;

  constructor(searchTerm: string, websitePageNumber: number) {
    
    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${this.searchTerm}&offset=${(this.pageNum - 1) * this.numOfResults}&limit=${this.numOfResults}&fields=url,title,abstract`;
  }

  // Function to make the request object
  makeRequest() {

    // The request object
    const request = {
      "url" : this.url,
      "method" : "GET",
      "redirect" : "follow",
      "headers" : {
        "Accept" : "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type" : "application/json",
        "DNT" : "1",
        "Referer" : "https://www.google.com",
        "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36"
      }
    }

    // Returns the request object
    return request;
  }

  // Function to set the response
  async setResponse(response: Response) {
    this.response = await response.json();
  }

  // Function to parse JSON and return the html links
  parse() {

    // The list of websites
    const websiteList = [];

    // Iterates the objects returned
    for (const paper of this.response.data) {

      // Checks if the abstract exists
      if (paper.abstract != null) {

          // Adds the website object to the list of websites
        websiteList.push({"url": paper.url, "title" : paper.title, "text" : paper.abstract});
      }

      // Otherwise just add the website to the list
      else websiteList.push(paper.url);
    }

    // Returns the list of websites
    return websiteList;
  }
}


// The class for PubMed
 export class PubMed extends SearchEngine {

  constructor(searchTerm: string, websitePageNumber: number) {
    
    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.url = `https://pubmed.ncbi.nlm.nih.gov/?term=${this.searchTerm}&page=${this.pageNum}`;
  }

  // Function to parse the DOM of the HTML and return the list of links
  parse() {

    // Gets the document object from the HTML
    const doc = parse(this.response);

    // Gets the element with the results
    const resultDiv = doc.querySelector(".search-results-chunk.results-chunk");

    // Gets the hostname of the page
    const host = this.url.match(HOST_NAME_REGEX)![0];

    // Gets the IDs of the results given
    const resultIDs = resultDiv!.getAttribute("data-chunk-ids");

    // The list of urls
    const urls = [];

    // Iterates the list of IDs and create URLs from them
    for (const id of resultIDs!.split(",")) {

      // Add the url to the list
      urls.push(`${host}/${id}/`);
    }

    // Return the results list
    return urls;
  }
}


// The class for BASE
export class BASE extends SearchEngine {

  constructor(searchTerm: string, websitePageNumber: number) {
    
    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.url = `https://www.base-search.net/Search/Results?lookfor=${this.searchTerm}&page=${this.pageNum}&filter[]=f_dclang:eng&filter[]=f_dctypenorm:121`;
  }

  // Function to parse the DOM of the HTML and return the list of links
  parse() {

    // Calls the general parser function and returns the result
    return parseSearchEngineResults(this.url, this.response, 'a.link1.bold:not([href$=".pdf"])', "href", false);
  }
}


// The class for the Directory of Open Access Journals
export class DOAJ extends SearchEngine {

  numOfResults = 10;

  constructor(searchTerm: string, websitePageNumber: number) {
    
    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.url = `https://www.doaj.org/api/search/articles/${this.searchTerm}?page=${this.pageNum}&pageSize=${this.numOfResults}`;
  }

  // Function to set the response
  async setResponse(response: Response) {
    this.response = await response.json();
  }

  // Function to parse the DOM of the HTML and return the list of links
  parse() {

    // The list of websites
    const websiteList = [];

    // Iterate the list of results
    for (const result of this.response.results) {

      // Gets the website url
      const url = result.bibjson.link[0].url;

      // Checks if the abstract has text
      if (result.bibjson.abstract) {

        // Adds the url to the list of websites
        websiteList.push({"url" : url, "title" : result.bibjson.title, "text" : result.bibjson.abstract});
      }

      // Otherwise just add the website to the list
      else websiteList.push(url);
    }

    // Returns the list of websites
    return websiteList;
  }
}


// The class for Fatcat
export class Fatcat extends SearchEngine {

  numOfResults = 25;

  constructor(searchTerm: string, websitePageNumber: number) {
    
    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.url = `https://fatcat.wiki/release/search?q=${this.searchTerm}&offset=${(this.pageNum - 1) * this.numOfResults}`;
  }

  // Function to parse the DOM of the HTML and return the list of links
  parse() {

    // Calls the general parser function and returns the result
    return parseSearchEngineResults(this.url, this.response, "div.ui.container.text > div > a:nth-of-type(2)", "href", false);
  }
}


// The class for CiteSeerX
export class CiteSeerX extends SearchEngine {

  constructor(searchTerm: string, websitePageNumber: number) {
    
    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.url = `http://citeseerx.ist.psu.edu/search?q=${this.searchTerm}&t=doc&sort=rlv&start=${(this.pageNum - 1) * this.numOfResults}`;
  }

  // Function to parse the DOM of the HTML and return the list of links
  parse() {

    // Calls the general parser function and returns the result
    return parseSearchEngineResults(this.url, this.response, "a.remove.doc_details", "href", true);
  }
}


// The class for MedlinePlus
export class MedlinePlus extends SearchEngine {

  constructor(searchTerm: string, websitePageNumber: number) {

    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.url = `https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?v%3Aproject=medlineplus&v%3Asources=medlineplus-bundle&query=${this.searchTerm}&v:state=root%7Croot-${(this.pageNum - 1) * this.numOfResults}-10%7C0&`;
  }

  // Function to parse the DOM of the HTML and return the list of links
  parse() {

    // Calls the general parser function and returns the result
    return parseSearchEngineResults(this.url, this.response, "div.document-header > a", "href", true);
  }
}


// The class for AMiner
export class AMiner extends SearchEngine {

  numOfResults = 10;

  constructor(searchTerm: string, websitePageNumber: number) {

    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.url = `http://api.aminer.org/api/search/pub?query=${this.searchTerm}&offset=${(this.pageNum - 1) * this.numOfResults}&size=${this.numOfResults}`;
  }

  // Function to set the response
  async setResponse(response: Response) {
    this.response = await response.json();
  }

  // Function to parse the JSON response and return the website object
  parse() {

    // The list of websites
    const websiteList = [];
    
    // Iterates the results
    for (const result of this.response.result) {

      // If the length of the urls array is 0, continue the loop
      if (result.urls.length === 0) continue;

      // Otherwise if the abstract contains text
      else if (result.abstract) {

        // Add the website object to the list of websites
        websiteList.push({"url" : result.urls[0], "title" : result.title, "text" : result.abstract})
      }

      // If the abstract doesn't contain any text then just add the url
      else websiteList.push(result.urls[0]);
    }

    // Returns the list of websites
    return websiteList;
  }
}


// The class for OSTI (U.S. Department of Energy's Office of Scientific and Technical Information)
export class OSTI extends SearchEngine {

  constructor(searchTerm: string, websitePageNumber: number) {

    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.url = `https://www.osti.gov/search/semantic:${this.searchTerm}/page:${this.pageNum}`;
  }

  // Function to parse the DOM of the HTML and return the list of links
  parse() {

    // Calls the general parser function and returns the result
    return parseSearchEngineResults(this.url, this.response, "h2.title > a", "href", true);
  }
}





// Function to parse the search engine results
function parseSearchEngineResults(url: string, response: string, selector: string, attribute: string, requiresHost: boolean) {

  // Initialise the host variable
  let host = "";
  
  // Checks if the site needs the host name
  if (requiresHost) {
    
    // Gets the website hostname
    host = url.match(HOST_NAME_REGEX)![0];
  }
  
  // Gets the document object
  const doc = parse(response);

  // Gets all the links in the div
  const links = doc.querySelectorAll(selector);

  // The list of result links
  const results: string[] = [];

  // Iterates the links
  for (const link of links) {

    // Gets the href containing the link
    const href = link.getAttribute(attribute);

    // If the href isn't null
    if (href != null) {
      results.push(`${requiresHost ? host : ""}${href}`);
    }
  }

  // Returns the list of results
  return results;
}
