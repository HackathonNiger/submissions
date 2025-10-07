import ee
import requests

def get_soil_data_backup(lat: float, lon: float) -> dict:
    """Backup: ISRIC REST API for topsoil pH and organic carbon."""
    try:
        url = (
            f"https://rest.isric.org/soilgrids/v2.0/properties/query?"
            f"lon={lon}&lat={lat}&property=phh2o,soc&depth=0-5cm"
        )
        r = requests.get(url, timeout=10)
        if r.status_code != 200:
            return {"soil_pH": 6.5, "soil_org_carbon_pct": 1.2, "source": "default"}
        
        data = r.json()
        ph_raw = data["properties"]["phh2o"]["layers"][0]["depths"][0]["values"]["mean"]
        soc_raw = data["properties"]["soc"]["layers"][0]["depths"][0]["values"]["mean"]
        return {
            "soil_pH": round(ph_raw / 10, 2),
            "soil_org_carbon_pct": round(soc_raw / 10, 2),
            "source": "ISRIC Backup API"
        }
    except Exception:
        # Fallback default (global agricultural average)
        return {"soil_pH": 6.5, "soil_org_carbon_pct": 1.2, "source": "default"}


def get_climatology_data_backup(lat: float, lon: float) -> dict:
    """Backup: Open-Meteo climate API."""
    try:
        url = (
            f"https://climate-api.open-meteo.com/v1/climate?"
            f"latitude={lat}&longitude={lon}"
            f"&start=1991-01-01&end=2020-12-31"
            f"&daily=temperature_2m_max,precipitation_sum"
        )
        r = requests.get(url, timeout=10)
        if r.status_code != 200:
            return {"avg_temp_c": 27.0, "rainfall_total_mm": 1200, "source": "default"}

        data = r.json()
        temp = sum(data["daily"]["temperature_2m_max"]) / len(data["daily"]["temperature_2m_max"])
        precip = sum(data["daily"]["precipitation_sum"]) / len(data["daily"]["precipitation_sum"])
        return {"avg_temp_c": round(temp, 1), "rainfall_total_mm": round(precip, 0), "source": "Open-Meteo Backup"}
    except Exception:
        # Fallback default (subtropical climate)
        return {"avg_temp_c": 27.0, "rainfall_total_mm": 1200, "source": "default"}




def get_satellite_image_url(polygon_coords: list) -> str:
    """Get Sentinel-2 True Color image (auto-buffer for small areas)."""
    try:
        ee_coords = [[lon, lat] for lat, lon in polygon_coords]
        ee_polygon = ee.Geometry.Polygon(ee_coords)
        area_m2 = ee_polygon.area().getInfo()

        buffer_distance = 800 if area_m2 < 10_000 else 500 if area_m2 < 100_000 else 0
        region_for_visual = ee_polygon.buffer(buffer_distance).bounds() if buffer_distance > 0 else ee_polygon.bounds()

        image_collection = (
            ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
            .filterBounds(region_for_visual)
            .filterDate("2024-01-01", "2025-01-01")
            .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 10))
        )

        image = image_collection.median()
        if image.bandNames().size().getInfo() == 0:
            return "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"

        true_color = image.select(["B4", "B3", "B2"]).clip(region_for_visual)
        vis = {"bands": ["B4", "B3", "B2"], "min": 0, "max": 3000, "gamma": 1.2}

        return true_color.getThumbURL({
            **vis,
            "region": region_for_visual.getInfo(),
            "dimensions": 512,
            "format": "png"
        })

    except Exception:
        # Placeholder image fallback
        return "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"




def get_soil_data(polygon_coords: list, lat: float, lon: float) -> dict:
    """Soil pH and organic carbon (%), with fallback."""
    try:
        ee_coords = [[lon, lat] for lat, lon in polygon_coords]
        ee_polygon = ee.Geometry.Polygon(ee_coords)

        soil_image = ee.Image("projects/soilgrids-isric/phh2o_mean").select("phh2o_0-5cm_mean")
        soc_image = ee.Image("projects/soilgrids-isric/soc_mean").select("soc_0-5cm_mean")

        soil_val = soil_image.reduceRegion(
            ee.Reducer.mean(), ee_polygon, 250, bestEffort=True
        ).getInfo()
        soc_val = soc_image.reduceRegion(
            ee.Reducer.mean(), ee_polygon, 250, bestEffort=True
        ).getInfo()

        soil_pH = (soil_val.get("phh2o_0-5cm_mean") or 65) / 10
        soil_org_carbon = (soc_val.get("soc_0-5cm_mean") or 12) / 10

        return {"soil_pH": round(soil_pH, 2), "soil_org_carbon_pct": round(soil_org_carbon, 2), "source": "GEE"}
    except Exception:
        return get_soil_data_backup(lat, lon)


def get_climatology_data(polygon_coords: list, lat: float, lon: float) -> dict:
    """Rainfall + Temperature, with fallback."""
    try:
        ee_coords = [[lon, lat] for lat, lon in polygon_coords]
        ee_polygon = ee.Geometry.Polygon(ee_coords)

        # Rainfall (PERSIANN)
        precip_collection = (
            ee.ImageCollection("NOAA/PERSIANN-CDR")
            .filterDate("1983-01-01", "2024-01-01")
            .select("precipitation")
        )
        total_precip = precip_collection.sum().reduceRegion(
            ee.Reducer.mean(), ee_polygon, 5000, bestEffort=True
        ).getInfo()
        annual_precip_mm = list(total_precip.values())[0] / 41 if total_precip else 1200

        # Temperature (ERA5)
        temp_collection = (
            ee.ImageCollection("ECMWF/ERA5/MONTHLY")
            .filterDate("1979-01-01", "2024-01-01")
            .select("mean_2m_air_temperature")
        )
        temp_mean = temp_collection.mean().reduceRegion(
            ee.Reducer.mean(), ee_polygon, 30000, bestEffort=True
        ).getInfo()
        mean_temp_C = (list(temp_mean.values())[0] - 273.15) if temp_mean else 27.0

        return {
            "avg_temp_c": round(mean_temp_C, 1),
            "rainfall_total_mm": round(annual_precip_mm, 0),
            "source": "GEE"
        }
    except Exception:
        return get_climatology_data_backup(lat, lon)


def get_ndvi_mean(polygon_coords: list) -> float:
    """NDVI mean (fallback = 0.45 typical)."""
    try:
        ee_coords = [[lon, lat] for lat, lon in polygon_coords]
        ee_polygon = ee.Geometry.Polygon(ee_coords)

        s2 = (
            ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
            .filterBounds(ee_polygon)
            .filterDate("2024-01-01", "2025-01-01")
            .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
        )

        ndvi = s2.map(lambda img: img.normalizedDifference(["B8", "B4"]).rename("NDVI"))
        ndvi_mean = ndvi.mean().reduceRegion(
            ee.Reducer.mean(), ee_polygon, 20, bestEffort=True
        ).getInfo()
        return round(list(ndvi_mean.values())[0], 3)
    except Exception:
        return 0.45  # fallback average NDVI for cropland
