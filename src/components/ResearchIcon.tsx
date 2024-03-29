// The research icon

// Marks this as a client component
"use client";

import type { NextPage } from "next";
import { ThemeContext, ThemeContextType } from "./ThemeContextProvider";
import { CSSProperties, useContext } from "react";
import styles from "../styles/ResearchIcon.module.css";

const ResearchIcon: NextPage<{style?: CSSProperties}> = ({ style }) => {

  // Get the themeClass function
  const { themeClass } = useContext(ThemeContext) as ThemeContextType;
  
  return (
    <>
      <svg className={`${themeClass(styles, "icon")} ${styles.icon}`} style={style} viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Research Icon" clipPath="url(#clip0_1_12)">
          <path id="Ellipse 2" d="M68.9206 44.9014C81.6302 48.4516 92.5576 55.0672 100.116 63.7878C107.674 72.5083 111.471 82.8798 110.953 93.3965C110.436 103.913 105.632 114.028 97.2395 122.271C88.8466 130.515 77.3015 136.459 64.2804 139.24L61.4834 131.283C72.3341 128.965 81.9548 124.012 88.9487 117.142C95.9426 110.273 99.9456 101.844 100.377 93.0804C100.808 84.3167 97.6443 75.6739 91.3458 68.407C85.0472 61.14 75.9413 55.6271 65.3501 52.6687L68.9206 44.9014Z" fill="white" stroke="black" strokeWidth="3" strokeLinejoin="round" />
          <g id="Subtract">
            <path fillRule="evenodd" clipRule="evenodd" d="M67 144H33L40.0436 125H59.9565L67 144Z" fill="white" />
            <path className={styles["special-fill"]} d="M33 144L31.5935 143.479C31.4229 143.939 31.4883 144.454 31.7687 144.857C32.0491 145.26 32.509 145.5 33 145.5V144ZM67 144V145.5C67.4909 145.5 67.9508 145.26 68.2313 144.857C68.5117 144.454 68.5771 143.939 68.4064 143.479L67 144ZM40.0435 125V123.5C39.4162 123.5 38.8551 123.89 38.637 124.479L40.0435 125ZM59.9565 125L61.3629 124.479C61.1449 123.89 60.5838 123.5 59.9565 123.5V125ZM33 145.5H67V142.5H33V145.5ZM38.637 124.479L31.5935 143.479L34.4065 144.521L41.45 125.521L38.637 124.479ZM59.9565 123.5H40.0435V126.5H59.9565V123.5ZM68.4064 143.479L61.3629 124.479L58.55 125.521L65.5935 144.521L68.4064 143.479Z" fill="black" />
          </g>
          <rect id="Rectangle 7" x="16" y="144" width="68" height="14" fill="white" stroke="black" strokeWidth="3" strokeLinejoin="round" />
          <g className={styles.scope}>
            <rect id="piston" x="64.0881" y="18.0634" width="15" height="9" transform="rotate(30 64.0881 18.0634)" fill="white" stroke="black" strokeWidth="3" strokeLinejoin="round" />
            <rect id="Rectangle 4" x="54.3919" y="22.8576" width="27" height="42" transform="rotate(30 54.3919 22.8576)" fill="white" stroke="black" strokeWidth="3" strokeLinejoin="round" />
            <rect id="Rectangle 8" x="29.0618" y="56.7307" width="37" height="9" transform="rotate(30 29.0618 56.7307)" fill="white" stroke="black" strokeWidth="3" strokeLinejoin="round" />
            <rect id="Rectangle 5" x="64.624" y="9.13516" width="23" height="8" transform="rotate(30 64.624 9.13516)" fill="white" stroke="black" strokeWidth="3" strokeLinejoin="round" />
            <circle id="joint" cx="70.7746" cy="48.4819" r="7" transform="rotate(30 70.7746 48.4819)" fill="white" stroke="black" strokeWidth="3" />
            <g className={styles.lens3}>
              <path id="len3" d="M34.0247 69.9892L28.0321 66.5285L13.7032 74.7905C12.7458 75.3426 12.4176 76.5667 12.9705 77.5237L13.9722 79.2575C14.5246 80.2137 15.7475 80.5412 16.7039 79.989L34.0247 69.9892Z" fill="white" stroke="black" strokeWidth="3" strokeLinejoin="round" />
              <path className={styles.marker} d="M20.1995 79.7006L17.9484 75.8016L15.6984 71.9072" stroke="black" />
            </g>
            <g className={styles.lens2}>
              <path id="len2" d="M37.9852 72.2748L43.1814 75.2748L33.1814 92.5954C32.6291 93.5519 31.4059 93.8797 30.4493 93.3274L28.7173 92.3274C27.7607 91.7751 27.4329 90.5519 27.9852 89.5954L37.9852 72.2748Z" fill="white" stroke="black" strokeWidth="3" strokeLinejoin="round" />
              <path className={styles.marker} d="M28.1424 86.3375L35.928 90.8325" stroke="black" />
            </g>
            <g className={styles.lens1}>
              <path id="len1" d="M47.1474 77.5656L53.1407 81.0249L53.15 97.5652C53.1506 98.6704 52.2547 99.5666 51.1494 99.5663L49.1471 99.5657C48.0428 99.5654 47.1477 98.6701 47.1477 97.5657L47.1474 77.5656Z" fill="white" stroke="black" strokeWidth="3" strokeLinejoin="round" />
              <path className={styles.marker} d="M45.6496 94.3942L50.1518 94.3942L54.6494 94.3956" stroke="black" />
            </g>
          </g>
          <rect id="basePlate" x="30" y="117" width="40" height="8" rx="3" fill="white" stroke="black" strokeWidth="3" />
        </g>
        <defs>
          <clipPath id="clip0_1_12">
            <rect width="120" height="160" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};

export default ResearchIcon;