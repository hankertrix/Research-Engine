// The layout for the application

import React from "react";
import localFont from "next/font/local";
import { ThemeContextProvider } from "../components/ThemeContextProvider";
 
// The Black Chancery font
const blackChancery = localFont({
  src: "BlackChancery-Regular.ttf",
  display: "swap"
});

// Export to the root layout
export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={blackChancery.className}>
      <body>
        <ThemeContextProvider>{children}</ThemeContextProvider>
      </body>
    </html>
  );
}