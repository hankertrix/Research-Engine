// The main page of the application

import type { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, FormEvent } from "react";
import { ThemeContext, ThemeContextType } from "../components/ThemeContextProvider";
import searchIcon from "../../public/search.svg";
import ResearchIcon from "../components/ResearchIcon";
import Footer from "../components/Footer";
import ThemeToggler from "../components/ThemeToggler";
import styles from "../styles/MainPage.module.css";

const MainPage: NextPage = () => {

  // Gets the router
  const router = useRouter();
  
  // Gets the themeClass function
  const { themeClass } = useContext(ThemeContext) as ThemeContextType;

  // The function to handle the search form submission
  async function handleSearch (event: FormEvent<HTMLFormElement>) {
    
    // Prevents the default behaviour
    event.preventDefault();

    // Gets the search term
    const searchTerm = (event.target as EventTarget & {search: HTMLInputElement}).search.value.trim();

    // If the search term contains a value
    if (searchTerm) {

      // Search for the value
      router.push(`/search?q=${searchTerm}`);
    }
  }
  
  return (
    <>

      {/* Header */}
      <Head>
        <title>Research Engine</title>
        <meta name="description" content="The main page of the Research Engine" />
      </Head>

      <div className={styles["page-wrapper"]}>
  
        {/* Main Content */}
        <main className={`${styles.main} ${themeClass(styles, "main")} ${styles.flex}`}>
          <div className={`${styles.wrapper} ${styles.flex}`}>
  
            {/* The icon part */}
            <div className={`${styles["icon-wrapper"]} ${styles.flex}`}>
              <div className={styles.icon}>
                <ResearchIcon />
              </div>
              <div className={styles.name}><span>Research</span><span>Engine</span></div>
            </div>
          
            {/* The search bar part */}
            <div className={`${styles["search-bar"]} ${styles.flex}`}>
  
              {/* The button to toggle the theme */}
              <div className={styles.themeToggle}>
                <ThemeToggler />
              </div>
  
              {/* The search form part */}
              <form className={`${styles.flex} ${styles.form}`} onSubmit={handleSearch}>
                <input type="text" name="search" placeholder="Research..." className={styles.input}></input>
                <button type="submit" className={styles.btn} title="Search"><Image src={searchIcon} width={20} height={20} style={{background: "transparent"}} priority={true} alt="Search" /></button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MainPage;