"use client";
import Script from "next/script";
import React from "react";

type AdsenseTypes = {
  pId: string;
};

const AdSense = ({ pId }: AdsenseTypes) => {
  const source = process.env.ADSTERRA_SRC as string;
  return (
    // <Script
    //     async
    //     src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
    //     crossOrigin='anonymous'
    //     strategy='afterInteractive'
    // />
    <Script
      type="text/javascript"
      src={source}
    />
  );
};

export default AdSense;
