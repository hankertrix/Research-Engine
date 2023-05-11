// The 404 not found page

import { redirect } from "next/navigation";

export default function NotFound() {

  // Redirects the user to the main page
  redirect("/");
}