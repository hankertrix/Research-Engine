// A test page to test components

import type { NextPage } from "next";
import SearchBar from "../components/SearchBar";

// The test page
const Test: NextPage = () => {
  return (
    <div>
      <SearchBar query=""/>
    </div>
  );
};

export default Test;