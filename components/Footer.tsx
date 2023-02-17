// The footer element that appears on all pages

import type { NextPage } from "next";
import Image from "next/image";
import { CSSProperties, useContext } from "react";
import { ThemeContext, ThemeContextType } from "../pages/_app";
import replitIcon from "../public/replit.png";
import githubIcon from "../public/github.png";
import styles from "../styles/Footer.module.css";

// The footer
const Footer: NextPage<{style?: CSSProperties}> = ({ style }) => {

  // Gets the theme class function
  const { theme, themeClass } = useContext(ThemeContext) as ThemeContextType;

  // The icon width and height
  const iconSize = 25;
  
  return (
      <footer className={`${styles.footer} ${themeClass(styles, "footer")} ${styles.flex}`} style={style}>
        <a href="https://replit.com/@hankertrix/Research-Engine?v=1#LICENSE.txt" title="Copyright notice and license" className={`${styles.copyleft} ${styles.flex}`} rel="noopener noreferrer">
          <div>Copyleft&nbsp;<span className={styles.symbol}>©</span>&nbsp;2022 Hankertrix.&nbsp;</div> <div>All Wrongs Reserved.</div></a>
        <div className={styles["source-wrapper"]}>
          <a href="https://replit.com/@hankertrix/Research-Engine?v=1" className={`${styles.source} ${styles.flex}`} title="View source code on Replit" rel="noopener noreferrer">Source:</a>
          <div className={`${styles["icon-wrapper"]} ${styles.flex}`}>
            <a href="https://replit.com/@hankertrix/Research-Engine?v=1" title="View source code on Replit" rel="noopener noreferrer"><Image src={replitIcon} width={iconSize} height={iconSize} priority={true} alt="View source code on Replit" /></a>
            <a href="https://github.com/hankertrix/Research-Engine" title="View source code on Github" rel="noopener noreferrer"><Image src={githubIcon} width={iconSize} height={iconSize} priority={true} alt="View source code on Github" /></a>
          </div>
        </div>
        <div className={styles.theme}>{theme === "light" ? "Light Mode" : "Dark Mode"}</div>
      </footer>
  );
};

export default Footer;