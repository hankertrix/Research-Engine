// The loading page component

import type { NextPage } from "next";
import Head from "next/head";
import { useContext, CSSProperties } from "react";
import { ThemeContext, ThemeContextType } from "../pages/_app";
import styles from "../styles/LoadingPage.module.css";
import ThemeToggler from "./ThemeToggler";
import LoadingIcon from "./LoadingIcon";

// The loading page
const LoadingPage: NextPage<{text?: string, isInitialLoad?: boolean}> = ({ text, isInitialLoad }) => {

  // Gets the themeClass function to theme the component
  const { themeClass } = useContext(ThemeContext) as ThemeContextType;

  // If text is not passed, give the text a default string of "Researching..."
  text = text ? text : "Researching";

  // If the isInitialLoad variable isn't passed, set it to false by default
  isInitialLoad = isInitialLoad ? isInitialLoad : false;
  
  // If the page is initially loading, set the text to loading instead of researching
  text = isInitialLoad ? "Loading" : text;

  return (
    <>

      {/* The title to display when the page is shown */}
      <Head>
        <title>Researching...</title>
      </Head>

      {/* The page wrapper */}
      <div className={`${styles.page} ${themeClass(styles, "page")} ${styles.flex} ${isInitialLoad ? styles.isInitialLoad : ""}`.trim()}>
        <div className={`${styles.wrapper} ${styles.flex}`}>

          {/* The glow effect */}
          <div className={`${styles["glow-wrapper"]} ${styles.flex}`}>
            <div className={styles.themeToggle}>
              <ThemeToggler style={{"--light-fill": "rgb(255, 100, 0)", "--light-fill-hover": "yellow"} as CSSProperties}/>
            </div>

            {/* The glowing circle background on the theme toggler button */}
            <div className={`${themeClass(styles, "glow-circle")} ${styles["glow-circle"]}`}></div>

            {/* The glow effect that covers the icon and the words */}
            <div className={`${themeClass(styles, "glow")} ${styles.glow}`}></div>
          </div>

          {/* The researching icon */}
          <div className={styles.icon}>
            <LoadingIcon style={{"--dark-background": "#1c1c1c"} as CSSProperties}/>
          </div>

          {/* The text that says "Researching..." */}
          <div className={styles.text}>{text}</div>
        </div>
      </div>
    </>
  );
};

export default LoadingPage;