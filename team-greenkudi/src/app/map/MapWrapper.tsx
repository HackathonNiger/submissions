"use client";

import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("./MapClient"), { 
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center bg-[--surface-elevated] rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-[--primary] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium text-[--text-primary]">Loading map...</span>
      </div>
    </div>
  )
});

export default function MapWrapper() {
  return <MapClient />;
}