import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// --- Type Definitions ---
interface ApiResult {
  status: string;
  state: string;
  area_sq_m: number;
  image_tile_url: string;
  polygon_bounds: number[][];
  rainfall_total_mm?: number;
  avg_temp_c?: number;
  soil_pH?: number;
  ndvi_mean?: number;
  soil_org_carbon_pct?: number;
  climatology?: string;
}

interface DashboardMetrics {
  temperature: number | null;
  rainfall: number | null;
  soil_pH: number | null;
  landAreaHa: string;
  ndvi: number | null;
  soilOrganicCarbon: number | null;
  predictedCrop: string;
  calculationDate: string;
}

// --- Fallback APIs ---
async function fetchOpenMeteo(lat: number, lon: number) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation`
    );
    const data = await res.json();
    return {
      temperature: data?.current?.temperature_2m ?? null,
      rainfall: data?.current?.precipitation ?? null,
    };
  } catch {
    return null;
  }
}

async function fetchNasaPower(lat: number, lon: number) {
  try {
    const res = await fetch(
      `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOT&community=RE&longitude=${lon}&latitude=${lat}&format=JSON`
    );
    const data = await res.json();
    const dates = Object.keys(data.properties.parameter.T2M);
    const lastDate = dates[dates.length - 1];
    return {
      temperature: data.properties.parameter.T2M[lastDate] ?? null,
      rainfall: data.properties.parameter.PRECTOT[lastDate] ?? null,
    };
  } catch {
    return null;
  }
}

// --- Component for AI Support ---
const AISupportSection: React.FC<{ advice: string | null }> = ({ advice }) => (
  <div className="bg-white p-6 rounded-xl shadow-2xl mb-8 border-l-8 border-yellow-500 w-full">
    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
      🤖 AI Farming Assistant Advice
    </h2>
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      {advice === null ? (
        <p className="text-gray-500 italic">
          Generating smart, actionable advice based on your field data...
        </p>
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap">{advice}</p>
      )}
    </div>
  </div>
);

// --- Hero Section ---
const HeroSection: React.FC<{ metrics: DashboardMetrics }> = ({ metrics }) => (
  <div className="bg-white p-6 rounded-xl shadow-2xl mb-8 border-t-8 border-green-600 px-6 md:px-10">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      ✨ Field Analysis & Prediction
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-sm font-medium text-gray-500">Avg Air Temperature</p>
        <p className="text-4xl font-extrabold text-red-600 mt-1">
          {metrics.temperature !== null ? metrics.temperature : "N/A"}
          {metrics.temperature !== null && (
            <span className="text-xl">°C</span>
          )}
        </p>
      </div>

      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm font-medium text-gray-500">Avg Topsoil pH</p>
        <p className="text-4xl font-extrabold text-yellow-600 mt-1">
          {metrics.soil_pH !== null ? metrics.soil_pH : "N/A"}
        </p>
      </div>

      <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
        <p className="text-sm font-medium text-gray-500">
          Predicted Optimal Crop
        </p>
        <p className="text-2xl md:text-3xl font-extrabold text-green-700 mt-1">
          {metrics.predictedCrop}
        </p>
      </div>
    </div>
  </div>
);

// --- Main Dashboard Page ---
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const apiResult = location.state?.apiResult as ApiResult | undefined;

  const [userInfo, setUserInfo] = useState<any>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    temperature: null,
    rainfall: null,
    soil_pH: null,
    landAreaHa: "—",
    ndvi: null,
    soilOrganicCarbon: null,
    predictedCrop: "Loading...",
    calculationDate: "N/A",
  });
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  // --- Load user info from localStorage ---
  useEffect(() => {
    const storedData = localStorage.getItem("farmInfo");
    if (storedData) {
      try {
        setUserInfo(JSON.parse(storedData));
      } catch (e) {
        console.error("Failed to parse userInfo:", e);
        setUserInfo({});
      }
    } else {
      setUserInfo({});
    }
  }, []);

  // --- Fetch AI Advice ---
  const fetchAiAdvice = async (result: ApiResult, predictedCrop: string) => {
    if (
      predictedCrop === "Calculating..." ||
      predictedCrop === "Error" ||
      aiAdvice !== null
    )
      return;

    setAiAdvice(null);

    const payload = {
      message:
        "Provide smart, actionable farming advice for this field, focusing on optimal crop choice and immediate steps for soil and water management.",
      info: {
        ...result,
        predicted_crop: predictedCrop,
      },
    };

    try {
      const response = await fetch("https://agro-karfi.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to fetch AI advice");

      const data = await response.json();
      setAiAdvice(data.response || "No advice received from AI.");
    } catch (error) {
      console.error("AI Advice Fetch Error:", error);
      setAiAdvice("Error generating advice. Please try again.");
    }
  };

  // --- Parse metrics, run fallback APIs, and predict ---
  useEffect(() => {
    if (!apiResult || userInfo === null) return;

    const parseMetricsAndPredict = async () => {
      const state: string = userInfo?.state ?? apiResult.state ?? "Unknown";

      let temperature: number | null = apiResult.avg_temp_c ?? null;
      let rainfall: number | null = apiResult.rainfall_total_mm ?? null;
      const soil_pH: number = apiResult.soil_pH ?? 6.5;
      const ndvi: number = apiResult.ndvi_mean ?? 0.45;
      const soilOrganicCarbon: number = apiResult.soil_org_carbon_pct ?? 1.2;

      const fertilizer_rate: number =
        userInfo?.fertilizer_rate_kg_per_ha ?? 50.0;
      const pesticide_rate: number =
        userInfo?.pesticide_rate_l_per_ha ?? 2.0;
      const farm_size: number = userInfo?.farm_size_ha ?? 1.5;
      const irrigated: number = userInfo?.irrigated_area_ha ?? 0.5;

      const landAreaHa = (apiResult.area_sq_m / 10000).toFixed(2);
      let predictedCrop = "Calculating...";

      // 🌦️ STEP 1: Use fallback APIs if missing temp or rainfall
      if (temperature === null || rainfall === null) {
        try {
          const bounds = apiResult.polygon_bounds;
          if (bounds && bounds.length > 0) {
            const latitudes = bounds.map((b) => b[1]);
            const longitudes = bounds.map((b) => b[0]);
            const lat =
              latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
            const lon =
              longitudes.reduce((a, b) => a + b, 0) / longitudes.length;

            console.log("🌍 Fetching fallback weather for:", { lat, lon });

            let fallback = await fetchOpenMeteo(lat, lon);
            if (
              !fallback ||
              fallback.temperature === null ||
              fallback.rainfall === null
            ) {
              console.log("⚠️ OpenMeteo failed, switching to NASA Power...");
              fallback = await fetchNasaPower(lat, lon);
            }

            if (fallback) {
              temperature = temperature ?? fallback.temperature ?? 25;
              rainfall = rainfall ?? fallback.rainfall ?? 100;
            }
          }
        } catch (error) {
          console.error("⚠️ Fallback API error:", error);
          temperature = temperature ?? 25;
          rainfall = rainfall ?? 100;
        }
      }

      // 🧠 STEP 2: Predict Optimal Crop
      try {
        const payload = {
          state,
          rainfall_total_mm: rainfall,
          avg_temp_c: temperature,
          ndvi_mean: ndvi,
          soil_ph: soil_pH,
          soil_org_carbon_pct: soilOrganicCarbon,
          fertilizer_rate_kg_per_ha: fertilizer_rate,
          pesticide_rate_l_per_ha: pesticide_rate,
          farm_size_ha: farm_size,
          irrigated_area_ha: irrigated,
        };

        const response = await fetch("https://agro-karfi.onrender.com/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Prediction failed: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        predictedCrop = result.predicted_crop || "Unknown";
      } catch (error) {
        console.error("Prediction failed:", error);
        predictedCrop = "Error";
      }

      // 🕒 STEP 3: Update Dashboard Metrics
      const calculationDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      setMetrics({
        temperature,
        rainfall,
        soil_pH,
        landAreaHa,
        ndvi,
        soilOrganicCarbon,
        predictedCrop,
        calculationDate,
      });

      // 🤖 STEP 4: Generate AI Advice
      fetchAiAdvice(apiResult, predictedCrop);
    };

    parseMetricsAndPredict();
  }, [apiResult, userInfo]);

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-50 font-sans">
      <div className="flex-1 flex flex-col overflow-y-auto w-full">
        {/* Title */}
        <div className="pt-6 md:pt-10 px-6 md:px-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Farming Analysis Dashboard
          </h1>
        </div>

        {/* Hero Section */}
        <HeroSection metrics={metrics} />

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full px-6 md:px-10">
          <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Total Land Area (Hectares)</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {metrics.landAreaHa} ha
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Calculation Date</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {metrics.calculationDate}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-indigo-500">
            <p className="text-sm text-gray-500">Avg Annual Rainfall</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              
               100 <span className="text-sm ml-1">mm</span>
              
            </p>
          </div>
        </div>

        {/* Satellite Image Section */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center min-h-[400px] px-6 md:px-10 mb-6 w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🛰️ Satellite Analysis
          </h2>
          {apiResult?.image_tile_url ? (
            <img
              src={apiResult.image_tile_url}
              alt="Satellite imagery of field"
              className="rounded-lg shadow-md border border-gray-300 w-full max-w-5xl h-96 object-contain"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400 border-2 border-dashed rounded p-4">
              No Satellite Image Available
            </div>
          )}
        </div>

        {/* AI Support Section */}
        <div className="px-6 md:px-10 w-full">
          <AISupportSection advice={aiAdvice} />
        </div>

        {/* Back Button */}
        <div className="px-6 md:px-10 pb-6 md:pb-10">
          <button
            onClick={() => navigate("/map")}
            className="p-3 rounded-lg w-full md:w-auto bg-teal-500 text-white hover:bg-teal-600 shadow-md transition duration-150"
          >
            ⬅️ Go Back to Mapping
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
