import { useEffect } from "react";

export default function GeoDebugger() {
  const requestLocation = (label: string) => {
    console.log(`🌍 ${label}: Requesting location...`);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log(
          `✅ ${label}: Got location → lat=${pos.coords.latitude}, lng=${pos.coords.longitude}, acc=${pos.coords.accuracy}m`
        );
      },
      (err) => {
        console.error(
          `❌ ${label}: Error (code ${err.code}) → ${err.message}`
        );
      },
      {
        enableHighAccuracy: false, // more relaxed
        timeout: 10000,            // 10s
        maximumAge: 60000,         // allow cached location
      }
    );
  };

  useEffect(() => {
    requestLocation("Initial");
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">🛰️ GeoDebugger</h2>
      <button
        onClick={() => requestLocation("Locate Me")}
        className="mt-2 rounded bg-blue-500 px-4 py-2 text-white"
      >
        Locate Me
      </button>
    </div>
  );
}
