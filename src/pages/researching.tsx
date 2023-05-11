// Just a page to display the loading page forever because it's too nice to look at

import type { NextPage } from "next";
import Head from "next/head";
import LoadingPage from "../components/LoadingPage";

const Researching: NextPage = () => {
  return (
    <>
      <Head>
        <meta name="description" content="Just a page to display the loading animation." />
      </Head>
      <LoadingPage />
    </>
  );
};

export default Researching;