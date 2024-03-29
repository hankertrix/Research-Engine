// The footer element that appears on all pages

// Marks this as a client component
"use client";

import type { NextPage } from "next";
import Image from "next/image";
import { CSSProperties, useContext } from "react";
import { ThemeContext, ThemeContextType } from "./ThemeContextProvider";
import codebergIcon from "../../public/codeberg.png";
import githubIcon from "../../public/github.png";
import replitIcon from "../../public/replit.png";
import styles from "../styles/Footer.module.css";

// The footer
const Footer: NextPage<{style?: CSSProperties}> = ({ style }) => {

  // Gets the theme class function
  const { theme, themeClass } = useContext(ThemeContext) as ThemeContextType;

  // The icon width and height
  const iconSize = 25;
  
  return (
      <footer className={`${styles.footer} ${themeClass(styles, "footer")}`} style={style}>
        <a href="https://codeberg.org/Hanker/Research-Engine/src/branch/main/LICENSE.txt" target="_blank" title="Copyright notice and license" className={styles.copyleft} rel="noopener noreferrer">
          <div>Copyleft&nbsp;<span className={styles.symbol}>©</span>&nbsp;2024 Hankertrix.&nbsp;</div><div className={styles["rights-notice"]}>All Wrongs Reserved.</div>
        </a>
        <div className={styles["source-wrapper"]}>
          <a href="https://codeberg.org/Hanker/Research-Engine" target="_blank" className={`${styles.source} ${styles.flex}`} title="View the source code on Codeberg" rel="noopener noreferrer">Source:</a>
          <div className={`${styles["icon-wrapper"]} ${styles.flex}`}>
            <a href="https://codeberg.org/Hanker/Research-Engine" target="_blank" title="View the source code on Codeberg" rel="noopener noreferrer"><Image src={codebergIcon} width={iconSize} height={iconSize} priority={true} alt="View the source code on Codeberg" /></a>
            <a href="https://github.com/hankertrix/Research-Engine" target="_blank" title="View the source code on GitHub" rel="noopener noreferrer"><Image src={githubIcon} width={iconSize} height={iconSize} priority={true} alt="View the source code on GitHub" /></a>
            <a href="https://replit.com/@hankertrix/Research-Engine?v=1" target="_blank" title="View the source code on Replit" rel="noopener noreferrer"><Image src={replitIcon} width={iconSize} height={iconSize} priority={true} alt="View the source code on Replit" /></a>
          </div>
        </div>
        <div className={styles.theme}>{theme === "light" ? "Light Mode" : "Dark Mode"}</div>
      </footer>
  );
};

export default Footer;