// Module to get the results from the other search engines

import * as engine from "./search-engines";
import { parse, HTMLElement } from "node-html-parser";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

// The dictionary type
interface Dictionary<T> {
  [Key: string | number] : T;
};

// The maximum number of results
const MAX_NUM_OF_RESULTS = 100;

// The CSS selector to exclude meta content that end with ellipsis or have a dash inside
const EXCLUDABLES = ':not([content$="..."]):not([content$="…"]):not([content~="-"]):not([content*="|"])'

// The CSS selector to get the abstract from the page
const META_ABSTRACT_CSS_SELECTOR = `meta[name*=".abstract"]${EXCLUDABLES}, meta[property*=".abstract"]${EXCLUDABLES}, meta[property="og:description"]${EXCLUDABLES}, meta[name*="Description"]${EXCLUDABLES}, meta[name="citation_abstract"]${EXCLUDABLES}`;

// The CSS selector to get the main content from the page
const ABSTRACT_CSS_SELECTOR = [

  // Sage Journals, Taylor & Francis Online, Life Science Ed (LSE), American Journal of Physiology, ASHA Wire
  "div.abstractSection.abstractInFull",

  // Springer, Scientific Reports (nature.com)
  "div#Abs1-content.c-article-section__content",

  // Wiley Online Library, British Educational Research Association (BERA)
  "div.article-section__content.en.main",

  // IOP Science
  "div.article-text.wd-jnl-art-abstract.cf",

  // CORE
  "section#abstract > p",

  // Cambridge Core (Cambridge University Press)
  "div.abstract",

  // Cambridge Apollo Respository
  "div.simple-item-view-description.item-page-field-wrapper.table > div",

  // Scholarworks, ODU Digital Commons
  "div#abstract > p",

  // Columbia Academic Commons
  "p.blacklight-abstract_ssi",

  // Dovepress
  "div.article-inner_html",

  // Trinity's Access to Research Archive (TARA)
  "div.simple-item-view-description.item-page-field-wrapper > span",

  // MOspace
  "div.simple-item-view-description.item-page-field-wrapper > div",

  // Pubmed
  "div#enc-abstract.abstract-content.selected",

  // Althea Medical Journal
  "div#articleAbstract > div",

  // MDPI
  "div.art-abstract.in-tab.hypothesis_container",

  // Frontiers
  "div.JournalAbstract > p",

  // MATEC Web of Conferences
  "div#head > p:not(.aff):not(.history):not(.bold)",

  // Paperity
  "div.col-lg-9.col-md-9.col-xs-12 > blockquote"
  
].join(", ");

// The set of common english words
const COMMON_WORDS = new Set(["about", "above", "actually", "after", "again", "against", "all", "almost", "also", "although", "always", "am", "an", "and", "any", "are", "as", "at", "be", "became", "become", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can", "could", "did", "do", "does", "doing", "down", "during", "each", "either", "else", "few", "for", "from", "further", "had", "has", "have", "having", "he", "he'd", "he'll", "hence", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "I", "I'd", "I'll", "I'm", "I've", "if", "in", "into", "is", "it", "it's", "its", "itself", "just", "let's", "may", "maybe", "me", "might", "mine", "more", "most", "must", "my", "myself", "neither", "nor", "not", "of", "oh", "on", "once", "only", "ok", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we'll", "we're", "we've", "were", "what", "what's", "when", "whenever", "when's", "where", "whereas", "wherever", "where's", "whether", "which", "while", "who", "whoever", "who's", "whose", "whom", "why", "why's", "will", "with", "within", "would", "yes", "yet", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"]);

// The regular expression to remove these common words
const REMOVE_COMMON_WORDS_REGEX = new RegExp(Array.from(COMMON_WORDS).join("|"), "g");

// The regular expression to remove non-words characters
const REMOVE_NON_WORDS_REGEX = /[^\w \-']/g

// The regular expression to remove multiple spaces
const REMOVE_EXTRA_SPACES_REGEX = / +/g;

// Regular expression string to match a sentence
const MATCH_SENTENCE_REGEX_STR = String.raw`(?:(?<=[\.\?!] ?|\n|^)[^\n\.\?!]*?[\.\?!]\s?)`;

// The html tag to use to mark the search term
const MARKING_TAG = "b";

// The regular expression to remove the marking tags
export const REMOVE_MARKING_TAG_REGEX = new RegExp(`</?${MARKING_TAG}>`, "g");


// Function to fetch all the requests, returning a list of responses
async function fetchAll(requests: {url?: string, method: string, redirect: string, headers: HeadersInit}[] | string[]) {

  // The length of the requests list
  const reqLen = requests.length;

  // The list of promises to be fulfilled
  const promisesList = new Array(reqLen);
  
  // Iterates the list of request objects
  for (let i = 0; i < reqLen; ++i) {

    // Gets the request object
    const request = requests[i];

    // Check if the request is just a url
    if (typeof request === "string") {

      // Adds the fetch request to the list
      promisesList[i] = fetch(request as RequestInfo, {
        "method" : "GET",
        "redirect" : "follow",
        "headers" : engine.HEADERS
      });
    }

    // If the request is an object
    else {

      // Pulls out the url from the request object
      const url = request.url as RequestInfo;
  
      // Makes a copy of the request object
      const copiedReq = Object.assign({}, request);

      // Deletes the url from the copied request
      delete copiedReq.url;
  
      // Adds the fetch request to the promises
      promisesList[i] = fetch(url, copiedReq as RequestInit);
    }
  }

  // Returns the responses
  return await Promise.all(promisesList);
}


// Not in use currently
// Function to retry getting the webpage
async function retryRequestsForSearchEngines(listOfResponses: Response[], searchEngines: engine.SearchEngineList) {

  // Length of the list of responses
  const resLen = listOfResponses.length;

  // Initialise the list of search engines that are able to set a response
  const responsedEngines = new Array(resLen);
  
  // Initialise the list of tasks
  const tasks = new Array(resLen);

  // Iterates the list of HTTP responses
  for (let i = 0; i < resLen; ++i) {

    // Gets the response object
    let response = listOfResponses[i];

    // The number of tries
    let tries = 0;

    // Gets the request object
    const request = searchEngines[i].makeRequest() as any;
    
    // Gets the url from the request object
    const url = request.url as RequestInfo;

    // Deletes the url from the request object
    delete request.url;
    
    // While loop to iterate try 3 times if the response is not ok
    while (response.status >= 400 && tries < 3) {

      // Gets the website again
      response = await fetch(url, request as RequestInit);

      // Breaks out of the loop if the response is ok
      if (response.status < 400) break;

      // Increment the number of tries
      ++tries;
    }

    // Checks if the response is ok
    if (response.status < 400) {

      // Adds the set response function to the list of tasks
      tasks[i] = searchEngines[i].setResponse(response);

      // Adds the search engine to the list of search engines
      responsedEngines[i] = searchEngines[i];
    }
  }

  // Sets all the responses in the search engine objects
  await Promise.all(tasks);

  // Return the new list of responses
  return responsedEngines;
}


// Function to remove the list of search engines that have invalid responses
async function filterSearchEngines(responses: Response[], searchEngines: engine.SearchEngineList) {

  // The new list of search engines
  const responsedEngines = [];

  // The tasks to set the response of the search engines
  const tasks = [];

  // Iterates the list of search engines
  for (let i = 0; i < searchEngines.length; ++i) {

    // Gets the search engine
    const engine = searchEngines[i];

    // The html response
    const response = responses[i];

    // Checks if the response of the search engine is a successful one
    if (response.status < 400) {

      // Adds the search engine to the list
      responsedEngines.push(engine);

      // Adds the task to set the response the list
      tasks.push(engine.setResponse(response));
    }
  }

  // Wait for all the set response function to return
  await Promise.all(tasks);

  // Returns the list of search engines
  return responsedEngines;
}


// Function to search the various search engines
async function searchWebpages(searchTerm: string, websitePageNumber: number) {

  // The list of search engines
  const searchEngines = [

    // 15 results or less
    new engine.ERIC(searchTerm, websitePageNumber),

    // 10 results
    new engine.CORE(searchTerm, websitePageNumber),

    // 10 results
    new engine.SemanticScholar(searchTerm, websitePageNumber),

    // 10 results
    new engine.PubMed(searchTerm, websitePageNumber),

    // 10 results or less
    new engine.BASE(searchTerm, websitePageNumber),

    // 10 results
    new engine.DOAJ(searchTerm, websitePageNumber),

    // 25 results
    new engine.Fatcat(searchTerm, websitePageNumber),

    // 10 results
    new engine.CiteSeerX(searchTerm, websitePageNumber),

    // 10 results
    new engine.Paperity(searchTerm, websitePageNumber),

    // 10 results
    new engine.AMiner(searchTerm, websitePageNumber),

    // 10 results
    new engine.OSTI(searchTerm, websitePageNumber)
  ];

  // The length of the list of search engines
  const engineLen = searchEngines.length;
  
  // The list of all requests
  const requests = new Array(engineLen);

  // Adds all the urls to the list
  for (let i = 0; i < engineLen; ++i) {

    // Gets the search engine
    const engine = searchEngines[i];

    // Add the url to the list of urls
    requests[i] = engine.makeRequest();
  }

  // Gets the responses from the websites
  let htmlResponses = await fetchAll(requests);

  // Retry getting the html response if it fails
  const responsedEngines = await filterSearchEngines(htmlResponses, searchEngines);

  // Returns the list of search engines that responded
  return responsedEngines;
}


// Function to get the list of websites
function getWebsiteList(searchEngines: engine.SearchEngineList, pageNumber: number) {

  // Length of the list of search engines
  const engineLen = searchEngines.length;

  // List of the search results from every search engine
  const searchEngineResultList = new Array(engineLen);

  // Iterates the list of search engines
  for (let i = 0; i < engineLen; ++i) {

    // Gets the search engine
    const engine = searchEngines[i];

    // Gets the list of websites
    const listOfWebsites: engine.Website[] = engine.parse();

    //console.log(engine.constructor.name);
    //console.log(listOfWebsites);

    // Adds the list of websites to the search engine result list
    searchEngineResultList[i] = listOfWebsites;
  }

  // The set of websites created from the search engine results as I don't want duplicate websites
  const websites: Set<engine.Website> = new Set(([] as engine.Website[]).concat(...searchEngineResultList));

  // The index to start the slice of the array of websites at
  const sliceIndex = ((pageNumber - 1) % 10) * 10;

  // Returns 10 websites from the set according to the page number
  return Array.from(websites).slice(sliceIndex, sliceIndex + 15);
}


// Function to tokenise the string to get the relevant words
function tokenise(searchTerm: string) {

  // Removes all the common words from the search term
  let editedSearchTerm = searchTerm.trim().replace(REMOVE_COMMON_WORDS_REGEX, "");

  // Removes all punctuation
  editedSearchTerm = editedSearchTerm.replace(REMOVE_NON_WORDS_REGEX, "");

  // Removes all the extra spaces
  editedSearchTerm = editedSearchTerm.replace(REMOVE_EXTRA_SPACES_REGEX, " ").trim();

  // Splits the search term and returns the list
  return editedSearchTerm.split(" ");
}


// Function to mark the searched term
function markSearchTerm(searchTerm: string, listOfMatchedResults: RegExpMatchArray | null) {

  // Checks if the list is null
  if (listOfMatchedResults == null) return [];

  // The regular expression to get the search term
  const regex = new RegExp(searchTerm, "gi");

  // Returns the array with the matched term marked
  return listOfMatchedResults.map(result => result.replace(regex, `<${MARKING_TAG}>${searchTerm}</${MARKING_TAG}>`));
}


// Not in use currently
// Function to remove the weirdness in a sentence
function fixSentence(searchTerm: string, sentence: string) {
	
  // The regular expression to search for the search term
  const regex = new RegExp(searchTerm, "gi");
	
  // The index of the search term
	const index = sentence.search(regex);
  
  // Initialise the starting index to slice the string from
  let startIndex = 0;
  
  // Initialise the ending index to stop the slice
  let endIndex = sentence.length;
  
  // If the search term isn't found, returns the sentence immediately
  if (index === -1) return sentence;
  
  // Walk towards the start of the string from the search term's position
  for (let i = index; i > 0; --i) {
  	
    // The current character
    const currentChar = sentence.slice(i, i + 1);
    
    // The previous character
    const previousChar = sentence.slice(i - 1, i);
    
    // Check if the current character is uppercase and the previous character is lowercase, a number of a full stop
    if (/[A-Z]/.test(currentChar) && /[a-z\d\.]/.test(previousChar)) {
    
    	// Sets the start index to the index of the current character
    	startIndex = i;
      
      // Breaks the loop
      break;
    }
  }
  
  // Iterates until the end of the string
  for (let j = index; j < sentence.length - 1; ++j) {
  	
    // The current character
    const currentChar = sentence.slice(j, j + 1);
    
    // The next character
    const nextChar = sentence.slice(j + 1, j + 2);
    
    // Checks if the current character is lowercase and the next character is uppercase or a number
    if (/[a-z]/.test(currentChar) && /[A-Z\d]/.test(nextChar)) {
    	
      // Sets the end index to 1 more than the current index
    	endIndex = j + 1;
      
      // Breaks the loop
      break;
    }
  }
  
  // Returns the fixed string
  return sentence.slice(startIndex, endIndex);
}


// Function to get the text from various websites
function getAbstract(doc: HTMLElement, hostname: string) {

  // Initialise the text
  let text: string | undefined = "";

  // Initialise the list of HTMLElements
  let elems: HTMLElement[] = [];

  // A switch statement to deal with all the cases
  switch (hostname) {

    // The default case
    default:

      // Gets the text content from the page
      text = doc.querySelector(META_ABSTRACT_CSS_SELECTOR) ? doc.querySelector(META_ABSTRACT_CSS_SELECTOR)!.getAttribute("content") : "";
      break;

    // If the url is a CiteSeerX link
    case "http://citeseerx.ist.psu.edu/":

      // Gets the text using this CSS selector
      text = doc.querySelector('meta[name="description"]') ? doc.querySelector('meta[name="description"]')!.getAttribute("content") : "";
      break;

    // If the url is a Science Direct Link
    case "https://www.sciencedirect.com":

      // Gets the list of elements
      elems = doc.querySelectorAll("div.abstract.author > div > p");
  
      // Gets the text from the elements
      text = elems.map(elem => elem.text).join(" ");
      break;
  }

  // Trims the text
  text = text!.trim();

  // Returns the text
  return text;
}


// Function to parse the html of the page and get back the text content
function getTextContentOfHTML(html: string, url: string) {

  // Parses the html using node html parser
  const doc = parse(html);

  // Gets the title of the page
  const title = doc.querySelector("title") ? doc.querySelector("title")!.text : "Untitled";

  // Calls the get abstract function to get the text of the document
  let text = getAbstract(doc, url.match(engine.HOST_NAME_REGEX)![0]);

  // If the text content is nothing
  if (!text) {

    // Use the CSS selectors to pull the content from the webpage
    text = doc.querySelector(ABSTRACT_CSS_SELECTOR) ? doc.querySelector(ABSTRACT_CSS_SELECTOR)!.text : "";
  }

  // If the text content is still nothing
  if (!text) {

    // Creates a dom
    const dom = new JSDOM(html);

    // Creates a new reader object
    const reader = new Readability(dom.window.document);

    // Gets the article object
    const article = reader.parse();

    // Sets the text to the text content in the html
    text = article ? article.textContent : "";
  }

  // Returns an object with the url, title and the text content
  return {"url" : url, "title" : title, "text" : text};
}


// Function to get the relevant parts from a single website
function searchRelevantParts(website: ({url: string, title: string, text: string} | {url: string, response: Response, html: string}), searchTerm: string) {

  // Initialise the website object
  let websiteObj = website as {url: string, title: string, text: string};

  // If the website has a html property, call the function to return an object containing all the information in it
  if ("html" in website) websiteObj = getTextContentOfHTML(website.html, website.url);
  
  // Gets the text from the website object
  let text = websiteObj.text;

  // The regex to find the sentence with the search term inside
  const searchTermSentenceRegex = String.raw`(?:(?<=[\.\?!] ?|\n|^)[^\n\.\?!]*?(?<!\w)${searchTerm}(?!\w)[^\n\.\?!]*?[\.\?!]\s?)`;

  // The regular expression string to search for at most 3 sentences around the search term
  const searchTermRegexStr = String.raw`${MATCH_SENTENCE_REGEX_STR}${searchTermSentenceRegex}${MATCH_SENTENCE_REGEX_STR}|${searchTermSentenceRegex}${MATCH_SENTENCE_REGEX_STR}{0,2}|${MATCH_SENTENCE_REGEX_STR}{0,2}${searchTermSentenceRegex}`;

  // The regular expression to search for the search term
  const searchTermRegex = new RegExp(searchTermRegexStr, "gmi");

  // Gets the relevant sentences
  let relevantSentences = markSearchTerm(searchTerm, text!.match(searchTermRegex));

  // Removes all the weirdness from the sentence
  relevantSentences = relevantSentences.map(sentence => sentence.trim());

  // The index of the token being iterated
  let tokenIndex = 0;

  // Gets the list of tokens
  const tokens = tokenise(searchTerm);

  // Iterate while the list of relevant sentences is less than 3
  while (relevantSentences.length < 3) {

    // Check if the index of the token is less than the length of the list of tokens
    if (tokenIndex < tokens.length) {

      // Gets the token
      const token = tokens[tokenIndex].trim();

      // Gets the regex string for the sentence the search token is in
      const tokenSentenceRegexStr = String.raw`(?:(?<=[\.\?!] ?|\n|^)[^\n\.\?!]*?(?<!\w)${token}(?!\w)[^\n\.\?!]*?[\.\?!]\s?)`;

      // Gets the regex string to search the sentences around the sentence containing the token
      const tokenRegexStr = String.raw`${MATCH_SENTENCE_REGEX_STR}${tokenSentenceRegexStr}${MATCH_SENTENCE_REGEX_STR}|${tokenSentenceRegexStr}${MATCH_SENTENCE_REGEX_STR}{0,2}|${MATCH_SENTENCE_REGEX_STR}{0,2}${tokenSentenceRegexStr}`;

      // Gets the regular expression to search for the sentences around the sentence containing the token
      const tokenRegex = new RegExp(tokenRegexStr, "gmi");

      // Gets the search results
      let tokenMatches = markSearchTerm(token, text!.match(tokenRegex));

      // Removes all the weirdness from the sentences
      tokenMatches = tokenMatches.map(sentence => sentence.trim());

      // Joins the search results with the list of relevant sentences
      relevantSentences = relevantSentences.concat(tokenMatches != null ? tokenMatches : []);

      // Increase the token index by 1
      ++tokenIndex;
    }

    // If the index of the token is more than the length of the list of tokens, breaks the loop
    else break;
  }

  // Slice the array of relevant parts so that there are only 3 relevant parts
  relevantSentences = relevantSentences.slice(0, 3);

  // Returns an object containing the array and the title of the page
  return {"title" : websiteObj.title, "link" : websiteObj.url, "sentences" : relevantSentences};
}


// Not in use currently
// Function to retry the requests, giving back a list of objects containing the response text and the link
async function retryRequestsWithBoundLink(responses: Response[], websiteList: string[]) {

  // Gets the list of website links and responses
  const websiteObjList = [];

  // Iterates the list of responses
  for (let i = 0; i < responses.length; ++i) {

    // Get the response
    let response = responses[i];

    // Initialise the number of tries
    let tries = 0;

    // Iterates while the response is not ok
    while (response.status >= 400 && tries < 3) {

      // Tries fetching the url
      response = await fetch(websiteList[i], {
        "method" : "GET",
        "redirect" : "follow",
        "headers" : engine.HEADERS
      });

      // Breaks the loop if the response is ok
      if (response.status < 400) break;

      // Increase the number of tries
      ++tries;
    }

    // If the response is ok
    if (response.status < 400) {

      // Adds the response to the list
      websiteObjList.push({url: websiteList[i], response: response, html: ""});
    }
  }

  // Returns the list of website objects
  return websiteObjList;
}


// Function to filter the websites that failed and create the website objects
function filterWebsiteList(responses: Response[], websiteList: string[]) {

  // Gets the list of website links and responses
  const websiteObjList = [];

  // Iterates the list of responses
  for (let i = 0; i < responses.length; ++i) {

    // Gets the response
    const response = responses[i];

    // Checks if the response is successful
    if (response.status < 400) {

      // Adds the website object to the list
      websiteObjList.push({url: websiteList[i], response: response, html: ""});
    }
  }

  // Returns the list of website objects
  return websiteObjList;
}


// Function to get the relevant results from the list of websites
async function getRelevantPartsList(websiteList: (string | {url: string, title: string, text: string})[], searchTerm: string) {

  // The length of the list of websites
  const websitesLen = websiteList.length;

  // The list of websites that need to be fetched
  const websitesToBeFetched: string[] = [];

  // The dictionary of website indexes
  const websiteIndexes: Dictionary<number> = {};

  // Iterates the list of websites
  for (let i = 0; i < websitesLen; ++i) {

    // Gets the website
    const website = websiteList[i];
    
    // Checks if the website is a string
    if (typeof website === "string") {

      // Adds the website to the list of websites to be fetched
      websitesToBeFetched.push(website);

      // Adds the website index to the dictionary of website indexes
      websiteIndexes[website] = i;
    }
  }

  // Gets all the websites in the website list
  const responses = await fetchAll(websitesToBeFetched);
  
  // Retry getting all the failed websites
  const websiteObjs = filterWebsiteList(responses, websitesToBeFetched);
  
  // Gets the html from the responses
  const htmls = await Promise.all(websiteObjs.map(obj => obj.response.text()));

  // Create a new variable to store the casted website list so typescript doesn't complain
  let tempWebsiteList = websiteList as any[];

  // Iterates the list of website objects
  for (let i = 0; i < websiteObjs.length; ++i) {

    // Gets the website object
    const websiteObj = websiteObjs[i];

    // Assign the html property of the object to the html
    websiteObj.html = htmls[i];

    // Gets the index of object from the dictionary
    const index = websiteIndexes[websiteObj.url];

    // Adds the website object to the list
    tempWebsiteList[index] = websiteObj;
  }

  // Creates a new list of websites
  let newWebsiteList: ({url: string, title: string, text: string} | {url: string, response: Response, html: string})[] = [];

  // Iterates the temporary list of websites
  for (const website of tempWebsiteList) {

    // If the website is a string, continue the loop
    if (typeof website === "string") continue;

    // Otherwise add the website to the list
    else newWebsiteList.push(website);
  }

  // Slice the new website list to only contain 10 results
  newWebsiteList = newWebsiteList.slice(0, 10);

  // Length of the new website list
  const newWebsiteListLen = newWebsiteList.length;

  // The list of relevant parts of each website
  const websiteListWithParts = new Array(newWebsiteListLen);

  // Iterate the website list
  for (let i = 0; i < newWebsiteListLen; ++i) {

    // Gets the website object
    const website = newWebsiteList[i];

    // Calls the function to search the relevant parts
    const relevantPartObject = searchRelevantParts(website, searchTerm);

    // Adds the object to the list of relevant parts for each website
    websiteListWithParts[i] = relevantPartObject;
  }

  // Returns the list of websites with their parts attached
  return websiteListWithParts;
}


// Function to create the search results
export async function createSearchResults(searchTerm: string, pageNumber: number) {

  // Trims off the white space in the search term
  searchTerm = searchTerm.trim();

  // Gets the website page number
  const websitePageNumber = Math.floor(10 * pageNumber / MAX_NUM_OF_RESULTS) + 1

  console.time("searchWebpages");

  // Gets the list of search engines
  const searchEngineList = await searchWebpages(searchTerm, websitePageNumber);

  console.timeEnd("searchWebpages");
  console.time("getWebsiteList");

  // Gets the list of websites from the list of search enginers
  const websiteList = getWebsiteList(searchEngineList, pageNumber);

  console.timeEnd("getWebsiteList");
  console.time("getRelevantPartsList");
  
  // Gets the list of relevant parts for each website
  const websiteListWithParts = await getRelevantPartsList(websiteList, searchTerm);

  console.timeEnd("getRelevantPartsList");

  // Returns the list of websites with parts
  return websiteListWithParts;
}