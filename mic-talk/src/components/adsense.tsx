"use client";
import Script from "next/script";
import React, { useState } from "react";

type AdsenseTypes = {
  pId: string;
};

const AdSense = () => {
  const source = process.env.ADSTERRA_SRC as string;
  const [isMinimized, setIsMinimized] = useState(false);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      <Script
        type="text/javascript"
        src={source}
        strategy="lazyOnload" // Lazy load the script
      />
      {/* Ad Container with minimize functionality */}
      <div
        id="ad-container"
        className={`fixed bottom-0 w-full ${
          isMinimized ? "h-10" : "h-32"
        } bg-gray-100 p-2 shadow-lg flex justify-between items-center`}
        style={{ transition: "height 0.3s" }}
      >
        <div className={`flex-grow ${isMinimized ? "hidden" : "block"}`}>
          {/* This is where the Adsterra ad will load */}
        </div>
        <button
          onClick={handleMinimize}
          className="text-sm text-blue-500 hover:underline ml-2"
        >
          {isMinimized ? "Expand Ad" : "Minimize Ad"}
        </button>
      </div>
    </>
  );
};

export default AdSense;
