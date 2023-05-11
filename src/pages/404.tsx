// The 404 not found page

import type { NextPage } from "next";
import { useRouter } from "next/router";

const NotFoundPage: NextPage = () => {

  // Gets the router
  const router = useRouter();

  // Redirects the user to the main page
  router.push("/");

  // Returns an empty page
  return (<></>);
}

export default NotFoundPage;