// A test page to test components

import type { NextPage } from "next";
import { CSSProperties } from "react";
import SearchBar from "../components/SearchBar";
import ThemeToggler from "../components/ThemeToggler";
import LoadingPage from "../components/LoadingPage";
import LoadingIcon from "../components/LoadingIcon";

// The test page
const Test: NextPage = () => {
  return (
    <div>
      <ThemeToggler />
      <LoadingIcon height="90vh" />
    </div>
  );
};

export default Test;