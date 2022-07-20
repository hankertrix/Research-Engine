// The search bar component and the top of the page

import type { NextPage } from "next";
import Image from "next/image";
import researchIcon from "../public/placeholder.svg";
import searchIcon from "../public/search.svg";
import styles from "../styles/SearchBar.module.css";

// The font size of the app name
const logoFontSize = 20;

// The font size of the search bar
const inputFontSize = 16;

// The search bar
const SearchBar: NextPage<{page: number}> = ({ page }) => {
  return (
    <div className={`${styles.searchBar} ${styles.container}`}>

      {/* The logo of the app */}
      <a className={`${styles.container} ${styles.logo}`} href="/" title="Go to the Homepage">
        <div className={styles.logoIcon} style={{minWidth: logoFontSize * 2}}>
          <Image src={researchIcon} width={logoFontSize * 2} height={logoFontSize * 2} priority={true} />
        </div>
        <div className={`${styles.text} ${styles.logoName}`} style={{fontSize: logoFontSize}}>Research Engine</div>
      </a>

      {/* The search bar part */}
      <div className={styles.inputBox}>
        <form className={`${styles.container} ${styles.form}`}>
          <input type="text" placeholder="Research..." className={`${styles.input} ${styles.text}`} style={{fontSize: inputFontSize}}></input>
          <button type="submit" className={styles.btn} title="Search"><Image src={searchIcon} width={20} height={20} style={{background: "transparent"}} priority={true} /></button>
        </form>
      </div>

      {/* The button to toggle between light and dark mode */}
      
    </div>
  );
};

export default SearchBar;