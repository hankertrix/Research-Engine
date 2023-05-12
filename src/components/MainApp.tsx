// The main application component that wraps everything in the app router

// Marks this as a client component
"use client";

import type { NextPage } from "next";
import React, { useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ThemeContextProvider } from "./ThemeContextProvider";
import LoadingPage from "./LoadingPage";

// The main application component
export default function MainApp({
  children
}: {
  children: React.ReactNode
}) {
  
  // The initial load state
  const [isInitialLoad, setInitialLoad] = useState(true);

  // Sets the initial load state to false once the component is mounted
  useEffect(() => {
    setInitialLoad(false);
  }, []);

  // Wraps everything in the theme context provider
  return (
    <ThemeContextProvider>
      <Suspense fallback={<LoadingPage text={isInitialLoad ? "Loading" : "Researching"} />}>
        {children}
      </Suspense>
    </ThemeContextProvider>
  );
}
