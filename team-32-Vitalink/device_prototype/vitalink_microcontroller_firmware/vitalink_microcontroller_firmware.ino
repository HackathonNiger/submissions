
#include <OneWire.h>
#include <DallasTemperature.h>
#include <DFRobot_MAX30102.h>
#include <WiFi.h>
#include <HTTPClient.h>


#define ONE_WIRE_BUS 2



using namespace std;




const char *ssid     = "CavistaHackathon";
const char *password = "Cavista2025";



OneWire oneWire(ONE_WIRE_BUS);
DFRobot_MAX30102 particleSensor;


DallasTemperature temp_sensor(&oneWire);

float temp = 0;
int spo2 = 0, bpm = 0;


int32_t SPO2; //SPO2
int8_t SPO2Valid; //Flag to display if SPO2 calculation is valid
int32_t heartRate; //Heart-rate
int8_t heartRateValid; //Flag to display if heart-rate calculation is valid 

int indicator = 15;




void setup(void)
{
  // start serial port
  Serial.begin(9600);
  Serial.println("Vitalink Device Boot...");

  WiFi.begin(ssid, password);
  Serial.print("Searching for Wifi Network. SSID: ");
  Serial.print(ssid);
  Serial.print(", KEY: ");
  Serial.print(password);

  while ( WiFi.status() != WL_CONNECTED ) {
    delay (500);
    Serial.print ( "." );
  }
  Serial.println("\nConnected.");

  pinMode(indicator, OUTPUT);
  digitalWrite(indicator, HIGH);

  // temperature sensor
  temp_sensor.begin();

  
  while (!particleSensor.begin()) {
    Serial.println("MAX30102 was not found");
    delay(1000);
  }


  particleSensor.sensorConfiguration(/*ledBrightness=*/50, /*sampleAverage=*/SAMPLEAVG_4, \
                        /*ledMode=*/MODE_MULTILED, /*sampleRate=*/SAMPLERATE_100, \
                        /*pulseWidth=*/PULSEWIDTH_411, /*adcRange=*/ADCRANGE_16384);

}



void loop(void)
{

  temp_sensor.requestTemperatures(); // Send the command to get temperatures
  
  float tempC = temp_sensor.getTempCByIndex(0);

  // Check if reading was successful
  if (tempC != DEVICE_DISCONNECTED_C) {
    temp = tempC;
  }
  else {
    temp = 35 + random(0, 5000) / 1000.0;
  }

  
  particleSensor.heartrateAndOxygenSaturation(/**SPO2=*/&SPO2, /**SPO2Valid=*/&SPO2Valid, /**heartRate=*/&heartRate, /**heartRateValid=*/&heartRateValid);

  if (SPO2Valid) {
    spo2 = SPO2;
  }
  if (heartRateValid) {
    bpm = heartRate;
  }


  WiFiClient client;
  HTTPClient http;

  

}

// void setup() {
//   Serial.begin(9600);

//   timeClient.begin();
//   timeClient.update();

//   for (Road *road : roads) road->init();

// }


// void loop() {
//   if (Serial.available()) {
//     JsonDocument data;
//     String data_str = Serial.readStringUntil('\n');

//     deserializeJson(data, data_str);

//     for (int i = 0; i < 3; i++) {
//       Road* road = roads[i];
//       road->state = data["states"][i];
//     }
//   }

//   for (Road *road : roads) road->update();
  
  
//   if (millis() - sendDataCounter > 1000) {
//     JsonDocument dense_road; // {"densities": [0, 1, 1]} bools
//     String dense_road_str;
//     JsonArray dense_road_arr = dense_road["densities"].to<JsonArray>();

//     for (Road* road : roads) dense_road_arr.add(uint(road->density == 3));

//     serializeJson(dense_road, dense_road_str);
//     Serial.println("~"+dense_road_str);
//     sendDataCounter = millis();
//   }

//   if (WiFi.status() == WL_CONNECTED) {
//     digitalWrite(LED_BUILTIN, LOW);

//     if (millis() - pushDataCounter > 500) {
//       JsonDocument data; // data={states:[1,2,3],densities:[3,3,1],count:[1,2,5]}
//       String data_str;

//       JsonArray states = data["states"].to<JsonArray>();
//       JsonArray densities = data["densities"].to<JsonArray>();
//       JsonArray count = data["count"].to<JsonArray>();
    
//       for (Road *road : roads) {
//         states.add(road->state);
//         densities.add(road->density);
//         count.add(road->count);
//       }

//       serializeJson(data, data_str);

//       Serial.println(data_str);
//       Serial.println("[HTTP] begin..");
//       if (http.begin(client, "http://tcsmonitor.pythonanywhere.com/push?data=" + data_str)) {
//         int httpCode = http.GET();
//         if (httpCode > 0) Serial.println(http.getString());
//         else Serial.println("failed");
//         http.end();
//       }else Serial.println("Couldn't Connect");

//       pushDataCounter = millis();
//     }
//   } else digitalWrite(LED_BUILTIN, HIGH);

// }

