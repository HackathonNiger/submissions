import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polygon,
} from "react-leaflet";
import L, { Map } from "leaflet";
import { useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";

// Map setup: Component to get the Leaflet Map instance after it's initialized
const MapWithSetup = ({ setMap }: { setMap: (map: L.Map) => void }) => {
  const map = useMap();
  useEffect(() => {
    setMap(map);
  }, [map, setMap]);
  return null;
};

// Fix Leaflet default icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Controls
const Controls = ({
  query,
  setQuery,
  manualMode,
  drawing,
  polygon,
  handleSearch,
  handleLocate,
  handleDrawPolygon,
  handleFinishDrawing,
  handleCalculate,
  handleClearPolygon,
  loading,
}: any) => (
  <div className="space-y-3">
    <div className="flex space-x-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Nigerian place..."
        className="flex-1 p-2 rounded text-black"
        disabled={loading}
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 px-3 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        🔍
      </button>
    </div>

    {manualMode && (
      <div className="text-yellow-300 text-sm">
        Could not auto-detect. Use search or click map.
      </div>
    )}

    <button
      onClick={handleLocate}
      className="p-2 rounded-lg w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50"
      disabled={loading}
    >
      📍 Locate Me
    </button>

    {drawing ? (
      <button
        onClick={handleFinishDrawing}
        className="p-2 rounded-lg w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50"
        disabled={loading}
      >
        🛑 Finish Drawing ({polygon.length} points)
      </button>
    ) : (
      <button
        onClick={handleDrawPolygon}
        className="p-2 rounded-lg w-full bg-green-500 hover:bg-green-600 disabled:opacity-50"
        disabled={loading}
      >
        ✏️ Draw Polygon
      </button>
    )}

    {polygon.length >= 3 && !drawing && (
      <>
        <button
          onClick={handleCalculate}
          className="bg-teal-500 hover:bg-teal-600 p-2 rounded-lg w-full disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "⏳ Calculating..." : "⚡ Calculate"}
        </button>
        <button
          onClick={handleClearPolygon}
          className="bg-red-500 hover:bg-red-600 p-2 rounded-lg w-full disabled:opacity-50"
          disabled={loading}
        >
          ❌ Clear Polygon
        </button>
      </>
    )}
  </div>
);

const Mapping = () => {
  const [map, setMap] = useState<Map | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [radius] = useState(200);
  const [polygon, setPolygon] = useState<[number, number][]>([]);
  const [drawing, setDrawing] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [initialFly, setInitialFly] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const navigate = useNavigate();

  // Geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setManualMode(true);
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setPosition(coords);
        setManualMode(false);

        if (!initialFly && map) {
          map.flyTo(coords, 16);
          setInitialFly(true);
        }
      },
      () => setManualMode(true),
      { enableHighAccuracy: true, timeout: 10000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [map, initialFly]);

  // Search address (restricted to Nigeria)
  const handleSearch = async () => {
    if (!query) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?countrycodes=NG&format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const results = await res.json();
      if (results.length > 0) {
        const lat = parseFloat(results[0].lat);
        const lon = parseFloat(results[0].lon);
        const coords: [number, number] = [lat, lon];
        setPosition(coords);
        setManualMode(false);
        if (map) map.flyTo(coords, 16);
      } else {
        alert("No results found in Nigeria");
      }
    } catch (err) {
      console.error("Search error", err);
    }
  };

  // Locate Me button
  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setPosition(coords);
        setManualMode(false);
        if (map) map.flyTo(coords, 16);
      },
      () => alert("Could not fetch location"),
      { enableHighAccuracy: true }
    );
  };

  // Polygon drawing
  const handleDrawPolygon = () => {
    if (!map) return;
    map.off("click");
    setDrawing(true);
    setPolygon([]);
    const drawnPoints: [number, number][] = [];

    const clickHandler = (e: L.LeafletMouseEvent) => {
      drawnPoints.push([e.latlng.lat, e.latlng.lng]);
      setPolygon([...drawnPoints]);
    };

    (map as any).currentClickHandler = clickHandler;
    map.on("click", clickHandler);
  };

  const handleFinishDrawing = () => {
    if (!map || !drawing) return;
    if ((map as any).currentClickHandler) {
      map.off("click", (map as any).currentClickHandler);
      (map as any).currentClickHandler = null;
    }
    setDrawing(false);
    if (polygon.length < 3) {
      alert("Polygon requires at least 3 points to be valid. Clearing points.");
      setPolygon([]);
    }
  };

  const handleClearPolygon = () => {
    setPolygon([]);
    setDrawing(false);
  };

  // Calculate with loading
  const handleCalculate = async () => {
    if (polygon.length < 3) {
      alert("Polygon must have at least 3 points");
      return;
    }
    try {
      setLoading(true); // start loading
      const res = await fetch("https://agro-karfi.onrender.com/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ polygon }),
      });
      const data = await res.json();
      navigate("/dashboard", { state: { apiResult: data } });
    } catch (err) {
      alert("Backend error");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="h-screen w-screen flex relative">
      {/* Sidebar (desktop only) */}
      <div className="hidden md:flex w-60 bg-gray-800 text-white p-4 flex-col">
        <h2 className="text-lg font-bold mb-4">Controls</h2>
        <Controls
          query={query}
          setQuery={setQuery}
          manualMode={manualMode}
          drawing={drawing}
          polygon={polygon}
          handleSearch={handleSearch}
          handleLocate={handleLocate}
          handleDrawPolygon={handleDrawPolygon}
          handleFinishDrawing={handleFinishDrawing}
          handleCalculate={handleCalculate}
          handleClearPolygon={handleClearPolygon}
          loading={loading}
        />
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={position || [6.5244, 3.3792]}
          zoom={15}
          maxZoom={19}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          {/* Better tile layer for Nigeria */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            subdomains={["a", "b", "c", "d"]}
          />

          {position && (
            <>
              <Marker position={position}>
                <Popup>
                  📍 {manualMode ? "Set manually" : "You are here"}
                </Popup>
              </Marker>
              <Circle center={position} radius={radius} />
            </>
          )}
          {polygon.length > 0 && <Polygon positions={polygon} color="red" />}
          <MapWithSetup setMap={setMap} />
        </MapContainer>

        {/* Mobile floating controls */}
        <div
          className="
            md:hidden absolute bottom-4 left-1/2 -translate-x-1/2
            w-[90%] bg-gray-800 text-white p-4
            rounded-xl shadow-lg z-50
            max-h-[50vh] overflow-y-auto
          "
        >
          <Controls
            query={query}
            setQuery={setQuery}
            manualMode={manualMode}
            drawing={drawing}
            polygon={polygon}
            handleSearch={handleSearch}
            handleLocate={handleLocate}
            handleDrawPolygon={handleDrawPolygon}
            handleFinishDrawing={handleFinishDrawing}
            handleCalculate={handleCalculate}
            handleClearPolygon={handleClearPolygon}
            loading={loading}
          />
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="text-white text-lg animate-pulse">
              ⏳ Processing your polygon...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mapping;
