// The arrow button to go to the next page or the previous page

// Marks this as a client component
"use client";

import type { NextPage } from "next";
import { useContext, CSSProperties } from "react";
import { ThemeContext, ThemeContextType } from "./ThemeContextProvider";
import styles from "../styles/ArrowButton.module.css";

// The arrow button
const ArrowButton: NextPage<{style?: CSSProperties}> = ({ style }) => {

  // Gets the themeClass function
  const { themeClass } = useContext(ThemeContext) as ThemeContextType;
  
  return (
    <svg className={`${styles.btn} ${themeClass(styles, "btn")}`} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 478.448 478.448">
      <g>
    		<polygon fill="black" x="0" y="0" points="131.659,0 100.494,32.035 313.804,239.232 100.494,446.373 131.65,478.448 377.954,239.232"/>
      </g>
    </svg>
  );
};

export default ArrowButton;