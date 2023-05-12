// The layout for the application

import "../styles/globals.css";
import React from "react";
import MainApp from "../components/MainApp";
 
// Export to the root layout
export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <MainApp>
          {children}
        </MainApp>
      </body>
    </html>
  );
}