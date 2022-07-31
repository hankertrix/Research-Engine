// A test page to test components

import type { NextPage } from "next";
import SearchBar from "../components/SearchBar";
import ThemeToggler from "../components/ThemeToggler";
import LoadingPage from "../components/LoadingPage";

// The test page
const Test: NextPage = () => {
  return (
    <div>
      <LoadingPage isInitialLoad={false} text="Researching..." />
    </div>
  );
};

export default Test;