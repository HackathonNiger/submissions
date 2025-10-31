import opencage from "opencage-api-client";
import axios from "axios";

function buildAddress(result) {
  if (!result) return "Unknown location";
  const c = result.components || {};

  // Prefer more meaningful components over "unnamed road"
  return [
    c.road && c.road !== "unnamed road" ? c.road : null,
    c.neighbourhood,
    c.suburb,
    c.city,
    c.state,
    c.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export const getNearbyHospitals = async (req, res) => {
  try {
    const { latitude, longitude, radius = 2000 } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Missing coordinates",
      });
    }

    // Reverse geocode the user's location
    const userGeo = await opencage.geocode({
      q: `${latitude},${longitude}`,
      key: process.env.OPENCAGE_API_KEY,
    });

    const userAddress = buildAddress(userGeo?.results?.[0]);

    // Query Overpass API for nearby hospitals
    const overpassQuery = `
      [out:json];
      node["amenity"="hospital"](around:${radius},${latitude},${longitude});
      out;
    `;
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      overpassQuery
    )}`;
    const response = await axios.get(overpassUrl);

    // Geocode each hospital’s lat/lon for a human-readable address
    let hospitals = await Promise.all(
      response.data.elements.map(async (e) => {
        let formattedAddress = "Address not available";

        try {
          const geoRes = await opencage.geocode({
            q: `${e.lat},${e.lon}`,
            key: process.env.OPENCAGE_API_KEY,
          });
          formattedAddress = buildAddress(geoRes?.results?.[0]);
        } catch (geoErr) {
          console.error(`Failed to geocode hospital ${e.id}`, geoErr.message);
        }

        return {
          id: e.id,
          name: e.tags?.name || "Unnamed Hospital",
          lat: e.lat,
          lon: e.lon,
          address: formattedAddress,
          tags: e.tags || {},
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Nearby hospitals fetched successfully",
      userLocation: userAddress,
      totalHospitals: hospitals.length,
      data: hospitals,
    });
  } catch (err) {
    console.error("Hospital error:", err);
    if (!res.headersSent) {
      return res.status(500).json({ error: err.message });
    }
  }
};
