const BASE_URL = "https://vitalink.pythonanywhere.com";

export async function pullVitals() {
  try {
    const response = await fetch(`${BASE_URL}/pull`);
    if (!response.ok) {
      throw new Error("Failed to fetch vitals");
    }

    const data = await response.json();

    console.log("Fetched vitals:", data);

    // Always return consistent structure
    return {
      spo2: data.spo2 ?? 0,
      bpm: data.bpm ?? 0,
      temp: data.temp ?? 0,
      sbp: data.sbp ?? 0,
      dbp: data.dbp ?? 0,
      current_step_count: data.current_step_count ?? 0,
      alert: data.alert ?? "",
      online: data.online ?? false,
    };
  } catch (error) {
    console.error("Error fetching vitals:", error);
    return null;
  }
}
