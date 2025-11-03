/*
  TEAM 12: Flood Alert System (Codefest Hackathon 2025)
  Components:
  - ESP32
  - HC-SR04 (Ultrasonic)
  - DHT11 – Temperature & Humidity
  - SIM800L – SMS Alerts
  - 16x2 LCD with I2C
  - Firebase – Realtime Database
*/

#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#include <time.h>

// ------------------- WiFi & Firebase -------------------
#define WIFI_SSID "RIMTECH 2.4"
#define WIFI_PASSWORD "RaindropsRemmy01@@##"
#define API_KEY "AIzaSyC2VTPo6HFQ95sNJqCLzT1kvS90hI8Javc"
#define DATABASE_URL "https://earlyfloodalertsystem-default-rtdb.firebaseio.com"

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// ------------------- Pin Definitions -------------------
#define DHTPIN 4
#define DHTTYPE DHT11
#define TRIG_PIN 5
#define ECHO_PIN 18
#define BUZZER_PIN 19
#define LED_PIN 15

// ------------------- LCD Setup -------------------
LiquidCrystal_I2C lcd(0x27, 16, 2);

// ------------------- DHT Setup -------------------
DHT dht(DHTPIN, DHTTYPE);

// ------------------- Variables -------------------
long duration;
float distance;
float temp, hum;

// ------------------- Thresholds -------------------
const int safeLevel = 100;   // cm
const int warningLevel = 50; // cm
const int dangerLevel = 25;  // cm

// ------------------- Functions -------------------
float getWaterLevel() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  duration = pulseIn(ECHO_PIN, HIGH, 30000); // 30ms timeout
  distance = duration * 0.034 / 2;
  return distance;
}

void sendSMS(String message) {
  Serial2.println("AT+CMGF=1");
  delay(1000);
  Serial2.println("AT+CMGS=\"+2348140687031\"");
  delay(1000);
  Serial2.println(message);
  Serial2.write(26); // CTRL+Z
  delay(4000);
  Serial.println("SMS Sent: " + message);
}

void triggerAlert(String level) {
  for (int i = 0; i < 3; i++) {
    digitalWrite(LED_PIN, HIGH);
    digitalWrite(BUZZER_PIN, HIGH);
    delay(700);
    digitalWrite(LED_PIN, LOW);
    digitalWrite(BUZZER_PIN, LOW);
    delay(400);
  }

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("ALERT: ");
  lcd.print(level);
  sendSMS("Flood Alert: " + level + " level reached!");
  Serial.println("Alert Triggered: " + level);
}

// ------------------- Setup -------------------
void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);

  lcd.init();
  lcd.backlight();
  dht.begin();

  Serial.begin(115200);
  Serial2.begin(9600);

  lcd.setCursor(0, 0);
  lcd.print("Flood Alert Sys");
  lcd.setCursor(0, 1);
  lcd.print("Initializing...");
  delay(2500);

  lcd.clear();
  lcd.print("BY TEAM 12 FOR");
  lcd.setCursor(0, 1);
  lcd.print("CODEFEST 2025");
  delay(3000);

  // ------------------- Connect WiFi -------------------
  lcd.clear();
  lcd.print("Connecting WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int wifi_attempts = 0;
  while (WiFi.status() != WL_CONNECTED && wifi_attempts < 40) {
    delay(500);
    Serial.print(".");
    wifi_attempts++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected!");
    lcd.clear();
    lcd.print("WiFi Connected");
  } else {
    lcd.clear();
    lcd.print("WiFi Failed!");
    Serial.println("WiFi connection failed!");
  }

  // ------------------- Time Sync (Important for SSL) -------------------
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  Serial.println("Synchronizing time...");
  delay(3000);

  // ------------------- Firebase Setup -------------------
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  config.token_status_callback = tokenStatusCallback; // For debug

  // Optional: set timezone (Nigeria = +1 hour)
  config.time_zone = 1;

  // Anonymous sign-in
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Firebase sign-up successful!");
  } else {
    Serial.printf("Firebase sign-up failed: %s\n", config.signer.signupError.message.c_str());
  }

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  Firebase.setDoubleDigits(5);

  Serial.println("Connecting to Firebase...");
  int retries = 0;
  while (!Firebase.ready() && retries < 20) {
    Serial.print(".");
    delay(500);
    retries++;
  }

  if (Firebase.ready()) {
    Serial.println("\nFirebase connected and ready!");
    lcd.clear();
    lcd.print("Firebase Ready");
  } else {
    Serial.println("\nFirebase failed to connect!");
    lcd.clear();
    lcd.print("FB Init Failed!");
  }
}

// ------------------- Main Loop -------------------
void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.reconnect();
    delay(2000);
  }

  float waterLevel = getWaterLevel();
  temp = dht.readTemperature();
  hum = dht.readHumidity();

  // Display values on LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("WL:");
  lcd.print(waterLevel);
  lcd.print("cm");

  lcd.setCursor(0, 1);
  if (!isnan(temp) && !isnan(hum)) {
    lcd.print("T:");
    lcd.print(temp);
    lcd.print("C H:");
    lcd.print(hum);
  } else {
    lcd.print("DHT Err");
  }

  // Flood level logic
  String status = "SAFE";
  if (waterLevel <= dangerLevel) {
    status = "DANGER";
    triggerAlert(status);
  } else if (waterLevel <= warningLevel) {
    status = "WARNING";
    triggerAlert(status);
  } else {
    digitalWrite(LED_PIN, LOW);
    digitalWrite(BUZZER_PIN, LOW);
  }

  // ------------------- Firebase Upload -------------------
  if (Firebase.ready()) {
    time_t now;
    time(&now);
    struct tm *timeinfo = localtime(&now);

    char timeKey[30];
    sprintf(timeKey, "%04d-%02d-%02d_%02d-%02d-%02d",
            timeinfo->tm_year + 1900,
            timeinfo->tm_mon + 1,
            timeinfo->tm_mday,
            timeinfo->tm_hour,
            timeinfo->tm_min,
            timeinfo->tm_sec);

    String basePath = "/flood_alert/station1/" + String(timeKey);

    Serial.println("\nUploading data to Firebase...");

    bool success =
      Firebase.RTDB.setFloat(&fbdo, basePath + "/water_level", waterLevel) &&
      Firebase.RTDB.setFloat(&fbdo, basePath + "/temperature", temp) &&
      Firebase.RTDB.setFloat(&fbdo, basePath + "/humidity", hum) &&
      Firebase.RTDB.setString(&fbdo, basePath + "/status", status) &&
      Firebase.RTDB.setString(&fbdo, basePath + "/timestamp", String(timeKey));

    if (success) {
      Serial.println("Data uploaded successfully at " + String(timeKey));
      lcd.clear();
      lcd.print("Firebase: OK");
      lcd.setCursor(0, 1);
      lcd.print(timeKey);
    } else {
      Serial.print("Firebase Error: ");
      Serial.println(fbdo.errorReason());
      lcd.clear();
      lcd.print("FB Upload Err");
      lcd.setCursor(0, 1);
      lcd.print(fbdo.errorReason().substring(0, 15));
    }
  } else {
    Serial.println("Firebase not ready!");
  }

  delay(10000); // Upload every 10 seconds
}
