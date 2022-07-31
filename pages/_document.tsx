// The page document to import fonts

import { Html, Head, Main, NextScript } from "next/document";

// The default document
export default function Document() {
  return (
    <Html>
      <Head>
        {/* Fonts */}
        <link rel="preload" href="/fonts/BlackChancery-Regular.ttf" as="font" type="font/ttf" crossOrigin="" />
        
        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
};