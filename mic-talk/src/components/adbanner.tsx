"use client";

import React, { useEffect, useState } from "react";

const AdBanner = ({
  dataAdSlot,
  dataAdFormat,
  dataFullWidthResponsive,
}: {
  dataAdSlot: string;
  dataAdFormat: string;
  dataFullWidthResponsive: boolean;
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={process.env.AD_CLIENT as string}
      data-ad-slot={dataAdSlot}
      data-ad-format={dataAdFormat}
      data-full-width-responsive={dataFullWidthResponsive.toString()}
    ></ins>
  );
};

export default AdBanner;
