"use client";

import React, { useEffect, useState } from "react";

const AdSense = () => {
  const adUrl = process.env.ADSTERRA_AD_URL;
  const [isMinimized, setIsMinimized] = useState(false);
  const [iframeSrc, setIframeSrc] = useState<string | undefined>(undefined);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    setIframeSrc(process.env.NEXT_PUBLIC_ADSTERRA_SRC || undefined);
    console.log(iframeSrc);
  }, []);

  return (
    <>
      <div
        id="ad-container"
        className={`fixed bottom-0 w-full ${
          isMinimized ? "h-10" : "h-32"
        } bg-gray-100 p-2 shadow-lg flex justify-between items-center`}
        style={{ transition: "height 0.3s" }}
      >
        {/* Conditionally display the iframe if not minimized */}
        {!isMinimized && (
          <iframe
            src={iframeSrc}
            frameBorder="0"
            scrolling="no"
            width="100%"
            height="100%"
          />
        )}
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
