// The loading page component

import { NextPage } from "next";
import { useContext } from "react";
import { ThemeContext, ThemeContextType } from "../pages/_app";
import styles from "../styles/LoadingPage.module.css";

// The loading page
const LoadingPage: NextPage<{text: string, isInitialLoad: boolean}> = ({ text, isInitialLoad }) => {

  // Gets the themeClass function to theme the component
  const { themeClass } = useContext(ThemeContext) as ThemeContextType;

  // If the page is initially loading, set the text to loading instead of researching
  text = isInitialLoad ? "Loading..." : text;
  
  return (
    <div className={`${styles.page} ${themeClass(styles, "page")} ${isInitialLoad ? styles.isInitialLoad : ""}`.trim()}>
      <div>{`${text}`}</div>
    </div>
  )
};

export default LoadingPage;