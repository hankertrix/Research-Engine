// A test page to test components

import type { NextPage } from "next";
import { CSSProperties } from "react";
import SearchBar from "../components/SearchBar";
import ThemeToggler from "../components/ThemeToggler";
import LoadingPage from "../components/LoadingPage";
import LoadingIcon from "../components/LoadingIcon";
import ResearchIcon from "../components/ResearchIcon";
import Footer from "../components/Footer";

// The test page
const Test: NextPage = () => {
  return (
    <div>
      <SearchBar query="" />
      <Footer />
    </div>
  );
};

export default Test;