"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function NavigationLoader() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!router) return;

    // Start loader on route push
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    // App Router doesn’t expose router.events
    // so we simulate using pathname changes
    setLoading(false); // reset when first mounted
    handleStart();
    const timeout = setTimeout(() => handleStop(), 600); // small delay

    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-md">
      <div className="relative w-[75px] h-[100px]">
        {/* Bars */}
        <div className="absolute bottom-0 left-0 w-[10px] h-1/2 bg-black origin-bottom animate-barUp1" />
        <div className="absolute bottom-0 left-[15px] w-[10px] h-1/2 bg-black origin-bottom animate-barUp2" />
        <div className="absolute bottom-0 left-[30px] w-[10px] h-1/2 bg-black origin-bottom animate-barUp3" />
        <div className="absolute bottom-0 left-[45px] w-[10px] h-1/2 bg-black origin-bottom animate-barUp4" />
        <div className="absolute bottom-0 left-[60px] w-[10px] h-1/2 bg-black origin-bottom animate-barUp5" />

        {/* Refreeg Logo as the ball */}
        <div className="absolute bottom-[10px] left-0 w-[14px] h-[14px] animate-ball624">
          <Image
            src="/logo.svg"
            alt="Refreeg Logo"
            width={14}
            height={14}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
