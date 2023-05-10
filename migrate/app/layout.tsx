// The layout for the application

import "../styles/globals.css";
import React from "react";
import { ThemeContextProvider } from "../components/ThemeContextProvider";
 
// Export to the root layout
export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeContextProvider>{children}</ThemeContextProvider>
      </body>
    </html>
  );
}