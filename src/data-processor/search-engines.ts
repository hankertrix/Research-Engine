// Module that contains the search engine classes

import { parse } from "node-html-parser";
import translatedScientificCategories from "./index-copernicus-categories";

// The type for the list of search engines
export type SearchEngineList = (ERIC | CORE | SemanticScholar | PubMed | BASE | DOAJ | Fatcat | AMiner | OSTI | PLOS_ONE | InternetArchiveScholar | IOPScience | ArXiv | SciElo | IndexCopernicus | IEEE_Xplore)[];

// The type for the website list
export type Website = (string | {url: string, title: string, text: string});

// Regular expression to get a website's hostname
export const HOST_NAME_REGEX = /https?:\/\/.*?(?=\/)/g;

// The user agent to use for every request
export const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36";

// The headers to use for every GET request
export const HEADERS = {
  "Accept" : "text/html",
  "Accept-Language": "en-US,en;q=0.9",
  "DNT" : "1",
  "Referer" : "https://www.google.com",
  "User-Agent" : USER_AGENT
}

// Abstract base class for to represent a search engine
abstract class SearchEngine {

  searchTerm: string;
  pageNum: number;
  numOfResults: number = 10;
  url: string;
  response: string | any;

  constructor(searchTerm: string, websitePageNumber: number) {

    // Change all the spaces in the search term into pluses
    const encodedSearchTerm = searchTerm.replace(" ", "+");

    // Sets the properties of the object
    this.searchTerm = encodedSearchTerm;
    this.pageNum = websitePageNumber;
    this.url = "";
    this.response = "";
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
    throw new Error("parse() is not implemented.");
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

  constructor(searchTerm: string, websitePageNumber: number, numOfResults: number) {
    
    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.numOfResults = numOfResults;
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
        "User-Agent" : USER_AGENT
      }
    }

    // Returns the request object
    return request;
  }
  

  // Function to make response for the object
  async setResponse(response: Response) {
    this.response = await response.json();
  }

  // Function to parse the JSON response and return the list of website objects
  parse() {

    // The list of results
    // Make the resultList an empty list if there are no results
    const resultList = this.response.results || [];

    // The list of websites
    const websiteList: Website[] = [];

    // Iterates the list of results
    for (const result of resultList) {

      // Continues the loop if the result has no id
      if (result.id == undefined) continue;
      
      // Builds a url from the id
      const url = `https://core.ac.uk/works/${result.id}`;

      // Checks if the result has an abstract
      if (result.abstract) {
      
        // Adds website object to the list of urls
        websiteList.push({"url": url, "title": result.title?.trim() ?? "", "text": result.abstract.trim()});
      }

      // Otherwise just add the url to the list
      else websiteList.push(url);
    }

    // Returns the list of website objects
    return websiteList;
  }
}


// The class for Semantic Scholar
export class SemanticScholar extends SearchEngine {

  constructor(searchTerm: string, websitePageNumber: number, numOfResults: number) {
    
    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.numOfResults = numOfResults;
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
        "User-Agent" : USER_AGENT
      }
    }

    // Returns the request object
    return request;
  }

  // Function to set the response
  async setResponse(response: Response) {
    this.response = await response.json();
  }

  // Function to parse the JSON response and return the list of website objects
  parse() {

    // The list of results
    // Make the resultList an empty list if there are no results
    const resultList = this.response.data || [];

    // The list of websites
    const websiteList: Website[] = [];

    // Iterates the objects returned
    for (const result of resultList) {

      // If the result doesn't have any url, continue the loop
      if (result.url == undefined) continue;

      // Checks if the abstract exists
      if (result.abstract != null) {

          // Adds the website object to the list of websites
        websiteList.push({"url": result.url, "title": result.title?.trim() ?? "", "text": result.abstract.trim()});
      }

      // Otherwise just add the website to the list
      else websiteList.push(result.url);
    }

    // Returns the list of website objects
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

    // The list of result IDs
    const resultIDList = resultIDs!.split(",");

    // Get the length of the list of result IDs
    const resultIDsLen = resultIDList.length;

    // The list of urls
    const urls: string[] = new Array(resultIDsLen);

    // Iterates the list of IDs and create URLs from them
    for (let i = 0; i < resultIDsLen; ++i) {

      // Gets the id
      const id = resultIDList[i];

      // Add the url to the list
      urls[i] = `${host}/${id}/`;
    }

    // Return the list of urls
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

  constructor(searchTerm: string, websitePageNumber: number, numOfResults: number) {
    
    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.numOfResults = numOfResults;
    this.url = `https://www.doaj.org/api/search/articles/${this.searchTerm}?page=${this.pageNum}&pageSize=${this.numOfResults}`;
  }

  // Function to set the response
  async setResponse(response: Response) {
    this.response = await response.json();
  }

  // Function to parse the JSON response and return the list of website objects
  parse() {

    // The list of results
    // Make the resultList an empty list if there are no results
    const resultList = this.response.results || [];

    // The list of websites
    const websiteList: Website[] = [];

    // Iterate the list of results
    for (const result of resultList) {

      // Gets the website url
      const url = result.bibjson.link[0].url;

      // If the url doesn't exist, continue the loop
      if (url == undefined) continue;

      // Checks if the abstract has text
      if (result.bibjson.abstract) {

        // Adds the url to the list of websites
        websiteList.push({"url": url, "title": result.bibjson.title?.trim() ?? "", "text": result.bibjson.abstract.trim()});
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


// The class for AMiner
export class AMiner extends SearchEngine {

  constructor(searchTerm: string, websitePageNumber: number, numOfResults: number) {

    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.numOfResults = numOfResults;
    this.url = `http://api.aminer.org/api/search/pub?query=${this.searchTerm}&offset=${(this.pageNum - 1) * this.numOfResults}&size=${this.numOfResults}`;
  }

  // Function to set the response
  async setResponse(response: Response) {
    this.response = await response.json();
  }

  // Function to parse the JSON response and return the list of website objects
  parse() {

    // The list of results
    // Make the resultList an empty list if there are no results
    const resultList = this.response.result || [];

    // The list of websites
    const websiteList: Website[] = [];
    
    // Iterates the results
    for (const result of resultList) {

      // If the length of the urls array is 0, continue the loop
      if (result.urls.length === 0) continue;

      // Otherwise if the abstract contains text
      else if (result.abstract) {

        // Add the website object to the list of websites
        websiteList.push({"url": result.urls[0], "title": result.title?.trim() ?? "", "text": result.abstract.trim()});
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


// The class for PLOS ONE
export class PLOS_ONE extends SearchEngine {

  constructor(searchTerm: string, websitePageNumber: number, numOfResults: number) {

    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.numOfResults = numOfResults;
    this.url = `https://api.plos.org/search?q=everything:${this.searchTerm}&start=${(this.pageNum - 1) * this.numOfResults}&rows=${this.numOfResults}&wt=json`;
  }

  // Function to set the response
  async setResponse(response: Response) {
    this.response = await response.json();
  }
  
  // Function to parse the JSON response and return the list of website objects
  parse() {

    // Gets the search results
    // Make the resultList an empty list if there are no results
    const resultList = this.response.response.docs || [];

    // The list of websites
    const websiteList = [];

    // Iterates the search results
    for (const result of resultList) {

      // If the result doesn't have an id, continue the loop
      if (result.id == undefined) continue;

      // Generate the url from the id
      const url = `https://doi.org/${result.id}`;

      // If the result has an abstract
      if (result.abstract) {
        
        // Adds the website object to the list
        websiteList.push({"url": url, "title": result.title_display?.trim() ?? "", "text": result.abstract.join("\n").trim()});
      }

      // Otherwise just add the website url to the list
      else websiteList.push(url);
    }

    // Returns the list of website objects
    return websiteList;
  }
}


// The class for Internet Archive Scholar
export class InternetArchiveScholar extends SearchEngine {

  numOfResults = 15;

  constructor(searchTerm: string, websitePageNumber: number) {

    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.url = `https://scholar.archive.org/search?q=${this.searchTerm}&offset=${(this.pageNum - 1) * this.numOfResults}`;
  }

  // Function to parse the DOM of the HTML and return the list of links
  parse() {

    // Calls the general parser function and returns the result
    return parseSearchEngineResults(this.url, this.response, 'div.three.wide.left.aligned.column.serp-right-col > a:not(a[href$=".pdf"])', "href", false);
  }
}


// The class for IOPScience
export class IOPScience extends SearchEngine {

  constructor(searchTerm: string, websitePageNumber: number, numOfResults: number) {

    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.numOfResults = numOfResults;
    this.url = `https://iopscience.iop.org/nsearch?terms=${this.searchTerm}&currentPage=${this.pageNum}`;
  }
  
  // Function to parse the DOM of the HTML and return the list of links
  parse() {

    // Calls the general parser function and returns the result
    return parseSearchEngineResults(this.url, this.response, "h2.art-list-item-title > a:first-of-type", "href", true);
  }
}


// The class for ArXiv
export class ArXiv extends SearchEngine {

  numOfResults = 50;

  constructor(searchTerm: string, websitePageNumber: number) {

    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.url = `https://arxiv.org/search/?query=${this.searchTerm}&searchtype=all&source=header&start=${(this.pageNum - 1) * this.numOfResults}`;
  }
  
  // Function to parse the DOM of the HTML and return the list of links
  parse() {

    // Calls the general parser function and returns the result
    return parseSearchEngineResults(this.url, this.response, "p.list-title.is-inline-block > a", "href", false);
  }
}


// The class for SciElo
export class SciElo extends SearchEngine {

  constructor(searchTerm: string, websitePageNumber: number, numOfResults: number) {

    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.numOfResults = numOfResults;
    this.url = `https://search.scielo.org/?lang=en&q=${this.searchTerm}&count=${this.numOfResults}&from=${(this.pageNum - 1) * this.numOfResults + 1}`;
  }
  
  // Function to parse the DOM of the HTML and return the list of links
  parse() {

    // Calls the general parser function and returns the result
    return parseSearchEngineResults(this.url, this.response, "div.results > div.item > div > div.line > img + a", "href", false);
  }
}


// The class for Index Copernicus
export class IndexCopernicus extends SearchEngine {

  constructor(searchTerm: string, websitePageNumber: number, numOfResults: number) {

    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.numOfResults = numOfResults;
    this.url = `https://journals.indexcopernicus.com/api/solrArticles/fullSearchByData`;
  }

  // Function to make the request
  makeRequest() {

    // Gets the payload to send to the server
    const payload = {
      "language": "all",
      "journal": {
        "scientificCategories": []
      },
      "journalWarningCodes": [],
      "hasMnisw": false,
      "journalMNISWYear": null,
      "journalMNISW": null,
      "translatedScientificCategories": translatedScientificCategories,
      "authorNames": "",
      "keywords": this.searchTerm,
      "pageNumber": this.pageNum,
      "size": this.numOfResults
    };

    // Creates the request object
    const request = {
      "url" : this.url,
      "method" : "POST",
      "redirect" : "follow",
      "body": JSON.stringify(payload),
      "headers" : {
        "Accept" : "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type" : "application/json",
        "DNT" : "1",
        "Referer" : "https://www.google.com",
        "User-Agent" : USER_AGENT
      }
    };

    // Returns the request object
    return request;
  }

  // Function to set the response
  async setResponse(response: Response) {
    this.response = await response.json();
  }
  
  // Function to parse the JSON response and return the list of website objects
  parse() {

    // Gets the search results
    // Make the resultList an empty list if there are no results
    const resultList = this.response.metadatas || [];

    // The list of websites
    const websiteList = [];

    // Iterates the search results
    for (const result of resultList) {

      // If the result doesn't have an id, continue the loop
      if (result.id == undefined) continue;

      // Generate the url from the id
      const url = `https://journals.indexcopernicus.com/search/article?articleId=${result.id}`;

      // Add the website's url to the list
      websiteList.push(url);
    }

    // Returns the list of urls
    return websiteList;
  }
}


// The class for IEEE Xplore
export class IEEE_Xplore extends SearchEngine {

  constructor(searchTerm: string, websitePageNumber: number, numOfResults: number) {

    // Calls the parent constructor
    super(searchTerm, websitePageNumber);
    this.numOfResults = numOfResults;
    this.url = `https://ieeexplore.ieee.org/rest/search`;
  }

  // Function to make the request
  makeRequest() {

    // Gets the payload to send to the server
    const payload = {
      "newsearch": true,
      "queryText": this.searchTerm,
      "highlight": true,
      "returnType": "SEARCH",
      "matchPubs": true,
      "pageNumber": this.pageNum,
      "rowsPerPage": this.numOfResults,
      "returnFacets": [
        "ALL"
      ]
    };

    // Creates the request object
    const request = {
      "url" : this.url,
      "method" : "POST",
      "redirect" : "follow",
      "body": JSON.stringify(payload),
      "headers" : {
        "Accept" : "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type" : "application/json",
        "DNT" : "1",
        "Referer" : `https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=${this.searchTerm}`,
        "User-Agent" : USER_AGENT
      }
    };

    // Returns the request object
    return request;
  }

  // Function to set the response
  async setResponse(response: Response) {
    this.response = await response.json();
  }
  
  // Function to parse the JSON response and return the list of website objects
  parse() {

    // Gets the search results
    // Make the resultList an empty list if there are no results
    const resultList = this.response.records || [];

    // The list of websites
    const websiteList = [];

    // Iterates the search results
    for (const result of resultList) {

      // If the result doesn't have a document link, continue the loop
      if (!result.documentLink) continue;

      // Generate the url from the id
      const url = `https://ieeexplore.ieee.org${result.documentLink}`;

      // Add the website's url to the list
      websiteList.push(url);
    }

    // Returns the list of urls
    return websiteList;
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

  // Length of the list of links
  const linksLen = links.length;

  // The list of result links
  const results: string[] = new Array(linksLen);

  // Iterates the links
  for (let i = 0; i < linksLen; ++i) {

    // Gets the link
    const link = links[i];

    // Gets the href containing the link
    const href = link.getAttribute(attribute);

    // If the href isn't null
    if (href != null) {

      // Adds the link to the list
      results[i] = `${requiresHost ? host : ""}${href}`;
    }
  }

  // Returns the list of results
  return results;
}
