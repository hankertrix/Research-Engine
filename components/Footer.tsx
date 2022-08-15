// The footer element that appears on all pages

import type { NextPage } from "next";
import Image from "next/image";
import { useContext } from "react";
import { ThemeContext, ThemeContextType } from "../pages/_app";
import replitIcon from "../public/replit.png";
import githubIcon from "../public/github.png";
import styles from "../styles/Footer.module.css";

// The footer
const Footer: NextPage = () => {

  // Gets the theme class function
  const { theme, themeClass } = useContext(ThemeContext) as ThemeContextType;

  // The icon width and height
  const iconSize = 20;
  
  return (
    <footer className={`${styles.footer} ${themeClass(styles, "footer")} ${styles.flex}`}>
      <a className={`${styles.copyleft} ${styles.flex}`}>
        <div>Copyleft&nbsp;<span className={styles.symbol}>©</span>&nbsp;2022 Hankertrix.&nbsp;</div> <div>All Wrongs Reserved.</div></a>
      <div className={styles["source-wrapper"]}>
        <a href="https://replit.com/@hankertrix/Research-Engine?v=1" className={`${styles.source} ${styles.flex}`}>Source:</a>
        <div className={`${styles["icon-wrapper"]} ${styles.flex}`}>
          <a href="https://replit.com/@hankertrix/Research-Engine?v=1"><Image src={replitIcon} width={iconSize} height={iconSize}/></a>
          <a href="https://github.com/hankertrix/Research-Engine"><Image src={githubIcon} width={iconSize} height={iconSize}/></a>
        </div>
      </div>
      <div className={styles.theme}>{theme === "light" ? "Light Mode" : "Dark Mode"}</div>
    </footer>
  )
}

export default Footer;