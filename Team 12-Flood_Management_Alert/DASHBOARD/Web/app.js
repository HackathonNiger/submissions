// ===================== Firebase Imports =====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ===================== Chart.js (from UNPKG) =====================
//import { Chart } from "https://unpkg.com/chart.js@4.4.1/dist/chart.mjs";


// ===================== Firebase Config =====================
const firebaseConfig = {
  apiKey: "ABC",
  authDomain: "earlyfloodalertsystem.firebaseapp.com",
  databaseURL: "https://earlyfloodalertsystem-default-rtdb.firebaseio.com",
  projectId: "earlyfloodalertsystem",
  storageBucket: "ABC",
  messagingSenderId: "ABC",
  appId: "ABC",
  measurementId: "ABC"
};

// ===================== Initialize Firebase =====================
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ===================== Firebase Listener =====================
const dbRef = ref(db, "flood_alert/station1");

onValue(dbRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) {
    console.warn("No data found in Firebase path flood_alert/station1");
    return;
  }

  // Get latest timestamp node
  const timestamps = Object.keys(data).sort();
  const latestTimestamp = timestamps[timestamps.length - 1];
  const latest = data[latestTimestamp];

  // Debug log
  console.log("✅ Latest Data:", latest);

  // Ensure all fields exist
  const water = latest.water_level ?? 0;
  const temp = latest.temperature ?? 0;
  const hum = latest.humidity ?? 0;
  const stat = latest.status ?? "UNKNOWN";

  // Update gauges
  updateGauge("waterLevel", water, "cm");
  updateGauge("temperature", temp, "°C");
  updateGauge("humidity", hum, "%");

  // Update status
  const statusIndicator = document.getElementById("statusIndicator");
  statusIndicator.textContent = `Status: ${stat}`;
  statusIndicator.className = "status " + stat.toLowerCase();

  // Update timestamp
  document.getElementById("timestamp").textContent =
    latest.timestamp || latestTimestamp;

  // Update chart
  addToChart(latest);
});

// ===================== Gauge Update Function =====================
function updateGauge(id, value, unit) {
  const gauge = document.getElementById(id);
  if (!gauge) return;

  const valElem = gauge.querySelector(".value");
  const fillRing = gauge.querySelector(".fill-ring");

  const percent = Math.min(100, Math.max(0, value));
  const offset = 126 - (percent / 100) * 126;

  fillRing.style.strokeDasharray = "126";
  fillRing.style.strokeDashoffset = offset;
  valElem.textContent = `${value.toFixed(1)} ${unit}`;
}

// ===================== Chart.js Setup =====================
const ctx = document.getElementById("sensorChart").getContext("2d");
const chartData = {
  labels: [],
  datasets: [
    {
      label: "Water Level (cm)",
      borderColor: "#2563eb",
      data: [],
      fill: false,
    },
    {
      label: "Temperature (°C)",
      borderColor: "#f97316",
      data: [],
      fill: false,
    },
    {
      label: "Humidity (%)",
      borderColor: "#16a34a",
      data: [],
      fill: false,
    },
  ],
};

const sensorChart = new Chart(ctx, {
  type: "line",
  data: chartData,
  options: {
    responsive: true,
    animation: false,
    scales: {
      x: { title: { display: true, text: "Timestamp" } },
      y: { beginAtZero: true },
    },
  },
});

// ===================== Add Data to Chart =====================
function addToChart(latest) {
  if (!latest.timestamp) return;

  chartData.labels.push(latest.timestamp);
  chartData.datasets[0].data.push(latest.water_level);
  chartData.datasets[1].data.push(latest.temperature);
  chartData.datasets[2].data.push(latest.humidity);

  if (chartData.labels.length > 20) {
    chartData.labels.shift();
    chartData.datasets.forEach((d) => d.data.shift());
  }

  sensorChart.update();
}
