// C++ firmware that get values such as temp, spo2 and bpm for two sensors max10102 spo2 sensor and ds18b20 temperature sensor
// it uses the values to make a get request to the python backend at vitalink.pythonanywhere.com with the values and server stores it.

#include <Wire.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <DFRobot_MAX30102.h>
#include <WiFi.h>
#include <HTTPClient.h>





#define ONE_WIRE_BUS 4
#define LED_R 5
#define LED_G 6
#define LED_B 7
#define BUZZER 10
#define SCL 22
#define SDA 20



using namespace std;




// const char *ssid     = "CavistaHackathon2025";
// const char *password = "Cavista2025";
const char *ssid     = "KHS_Engineering_2.4";
const char *password = "K@dAv0110";



OneWire oneWire(ONE_WIRE_BUS);
DFRobot_MAX30102 particleSensor;


DallasTemperature temp_sensor(&oneWire);

float temp = 0;
int spo2 = 0, bpm = 0;


int32_t SPO2; //SPO2
int8_t SPO2Valid; //Flag to display if SPO2 calculation is valid
int32_t heartRate; //Heart-rate
int8_t heartRateValid; //Flag to display if heart-rate calculation is valid 

int indicator = 7;

unsigned long pushDataCounter;




void setup(void)
{
  // start serial port
  Serial.begin(9600);
  Wire.begin(SDA, SCL);
  // Serial2.begin(115200, SERIAL_8N1, 16, 17);

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
    // Serial.println("MAX30102 was not found");
    delay(1000);
  }


  particleSensor.sensorConfiguration(/*ledBrightness=*/50, /*sampleAverage=*/SAMPLEAVG_4, \
                        /*ledMode=*/MODE_MULTILED, /*sampleRate=*/SAMPLERATE_100, \
                        /*pulseWidth=*/PULSEWIDTH_411, /*adcRange=*/ADCRANGE_16384);


  pushDataCounter = millis();
}


void updateSerial() {
  delay(500);
  while (Serial2.available()) {
    Serial.write(Serial2.read());
  }
  while (Serial.available()) {
    Serial2.write(Serial.read());
  }
}

void sendCMD(String cmd) {
  Serial2.println(cmd);
  updateSerial();
}


void loop(void)
{

  // if (Serial.available()){
  //   Serial.write(Serial.read());
  // }
  // if (Serial2.available()) {
  //   Serial.write(Serial2.read());
  // }

  temp_sensor.requestTemperatures(); // Send the command to get temperatures
  
  float tempC = temp_sensor.getTempCByIndex(0);

  // Check if reading was successful
  if (tempC != DEVICE_DISCONNECTED_C) {
    temp = tempC;
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

  if (WiFi.status() == WL_CONNECTED) {
    digitalWrite(indicator, HIGH);

    if (millis() - pushDataCounter > 1000) {

      Serial.println("[HTTP] begin..");
      String url = "http://vitalink.pythonanywhere.com/push?spo2=" + String(spo2) + "&temp=" + String(temp, 2) + "&bpm=" + String(bpm); 
      Serial.println(url);

      if (http.begin(client, url)) {
        int httpCode = http.GET();

        if (httpCode > 0) {
          Serial.println(http.getString());
        }
        else {
          Serial.println("failed");
        }
        http.end();
      }else {
        Serial.println("Couldn't Connect");
      }

      pushDataCounter = millis();
    }
  } else digitalWrite(indicator, LOW);

  String message = "";

  if (bpm> 90) {
    message = "Heartbeat rate is too high seek medical attention";
  }
  else if (bpm< 60) {
    message = "Signs of BradyCardia, seek medical attention";
  }
  if (temp > 38) {
    message += ". High temperature, Fever!";
  }
  else if (temp <= 35.1) {
    message += ". Signs of hypothermia";
  }
  if (spo2 < 90) {
    message += ". Hypoxemia signs. seek doctors help quickly.";
  }

  if (bpm> 90 || bpm < 60 || temp > 38 || temp < 35.1 || spo2 > 90) {
    // sendCMD("AT");
    // sendCMD("AT+CMGF=1");
    // sendCMD("AT+CMGS=\"" + phone_number + "\"");
    // sendCMD(message);
    // Serial2.write(26);
    // sendCMD("");
  }
}
