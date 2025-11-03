package com.example.early_flood_alert_system;

public class flood {

    private String status;
    private String timestamp;
    private Object water_level;
    private Object humidity;
    private Object temperature;

    public flood() {

    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public Object getWater_level() {
        return water_level;
    }

    public void setWater_level(Object water_level) {
        this.water_level = water_level;
    }

    public Object getHumidity() {
        return humidity;
    }

    public void setHumidity(Object humidity) {
        this.humidity = humidity;
    }

    public Object getTemperature() {
        return temperature;
    }

    public void setTemperature(Object temperature) {
        this.temperature = temperature;
    }

    public flood(String status, String timestamp, Object water_level, Object humidity, Object temperature) {
        this.status = status;
        this.timestamp = timestamp;
        this.water_level = water_level;
        this.humidity = humidity;
        this.temperature = temperature;
    }



}
