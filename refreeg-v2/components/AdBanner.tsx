"use client";

import { useEffect, useRef } from "react";

type AdBannerProps = {
  dataAdSlot?: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function AdBanner({
  dataAdSlot = "7642796033",
  dataAdFormat = "auto",
  dataFullWidthResponsive = true,
  className = "", // Add default empty string
  style = {}, // Add default empty object
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Inject the AdSense script only if it hasn't been added yet
    const scriptId = "adsbygoogle-js";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6133323682562865";
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    }

    // Try to push the ad
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error: any) {
      // Optional: handle error
      console.error(error.message);
    }
  }, []);

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-6133323682562865"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
        ref={adRef}
      />
    </div>
  );
}

export default AdBanner;
