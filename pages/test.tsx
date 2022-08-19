// A test page to test components

import type { NextPage } from "next";
import { CSSProperties } from "react";
import SearchBar from "../components/SearchBar";
import ThemeToggler from "../components/ThemeToggler";
import LoadingPage from "../components/LoadingPage";
import LoadingIcon from "../components/LoadingIcon";
import ResearchIcon from "../components/ResearchIcon";
import Footer from "../components/Footer";
import ArrowButton from "../components/ArrowButton";
import PageSelector from "../components/PageSelector";

// The test page
const Test: NextPage = () => {
  return (
    <div>
      <SearchBar query="" />
      <div style={{position: "absolute", backgroundColor: "red", width: "0.5px", height: "100vh", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: "1"}}></div>
      <Footer style={{position: "absolute", bottom: 0}} />
    </div>
  );
};

export default Test;