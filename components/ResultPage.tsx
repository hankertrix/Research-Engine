// The component to display the results using the data given

import type { NextPage } from "next";
import { useState, useEffect } from "react";

// The result type
export type Result = {
  title: string,
  sentences: string[],
  link: string
};

// The result page
const ResultPage: NextPage<{results: Result[], page: number, observer: IntersectionObserver | null}> = ({ results, page, observer }) => {

  // Track the reference to the page being rendered
  const [ref, setRef] = useState<HTMLElement | null>(null);

  
  // Observe and unobserve the page
  useEffect(() => {

    // If the reference exists, observe the page
    if (ref) observer?.observe(ref);

    // Returns a function to unobserve the page
    return () => {if (ref) observer?.unobserve(ref);};
  }, [observer, ref]);
  

  // The function to render all the results
  function render(data: Result[]) {

    // The list of elements to render
    const elemList = [];

    // Iterates the data returned by the api
    for (const result of data) {

      // The list of sentences
      const sentences = [];

      // Iterates the relevant sentences
      for (const sentence of result.sentences) {

        // Appends the sentence to the list of sentences
        sentences.push(<li key={sentence} dangerouslySetInnerHTML={{__html: sentence}} />);
      }

      // Adds the individual result to the list of elements
      elemList.push(
        <div key={`${result.title || "Untitled"}|${result.link}`}>
          <a href={result.link} title={result.link}>{result.title || "Untitled"}</a>
          <ol>
            {sentences.length !== 0 ? <div style={{marginBottom: "5px", textDecoration: "underline"}}>Relevant Sentences:</div> : <div style={{marginBottom: "20px"}}>No relevant sentences found.</div>}
            {sentences}
          </ol>
        </div>
      );
    }

    // Returns the element list
    return elemList;
  }

  // Returns the result of the render function
  return (
    <div ref={setRef} data-page={page}>
      {render(results)}
    </div>
  )
};

export default ResultPage;