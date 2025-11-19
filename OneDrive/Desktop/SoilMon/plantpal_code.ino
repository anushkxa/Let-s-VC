// PlantPal Stage-1 MVP - upload this
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include "DHT.h"

// ====== CONFIG ======
const char* ssid = "Abhi's sam.";
const char* password = "12345678";

#define DHTPIN D2       // DHT11 data pin
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

const int soilPin = A0;  // analog soil sensor
const int ledPin = D1;   // optional status LED

ESP8266WebServer server(80);

// calibration values for soil sensor (set by you after calibration)
int soilDry = 1024;   // dry raw
int soilWet = 405;      // wet raw
  // update after calibration

int soilPercent(int raw) {
  if(raw > soilDry) raw = soilDry;
  if(raw < soilWet) raw = soilWet;
  float pct = (float)(soilDry - raw) / (float)(soilDry - soilWet) * 100.0;
  if(pct < 0) pct = 0;
  if(pct > 100) pct = 100;
  return (int)pct;
}

String htmlPage(float temp, float hum, int soilP, int rawSoil) {
  String html = "<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width, initial-scale=1'>";
  html += "<title>PlantPal - Stage1</title>";
  html += "<style>body{font-family:Arial;text-align:center;margin:10px} .card{padding:12px;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,.15);display:inline-block;margin:8px}</style>";
  html += "</head><body><h2>PlantPal (Stage 1)</h2>";
  html += "<div class='card'><h3>Temperature</h3><p>" + String(temp,1) + " &deg;C</p></div>";
  html += "<div class='card'><h3>Humidity</h3><p>" + String(hum,1) + " %</p></div>";
  html += "<div class='card'><h3>Soil Moisture</h3><p>" + String(soilP) + " %</p><small>raw:" + String(rawSoil) + "</small></div>";
  html += "<p><a href='/data'>JSON data</a></p>";
  html += "</body></html>";
  return html;
}

void handleRoot() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  int raw = analogRead(soilPin);
  int sp = soilPercent(raw);
  server.send(200, "text/html", htmlPage(t, h, sp, raw));
}

void handleData() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  int raw = analogRead(soilPin);
  int sp = soilPercent(raw);
  String json = "{";
  json += "\"temperature\":" + String(t,1) + ",";
  json += "\"humidity\":" + String(h,1) + ",";
  json += "\"soil_percent\":" + String(sp) + ",";
  json += "\"soil_raw\":" + String(raw);
  json += "}";
  server.send(200, "application/json", json);
}

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  dht.begin();

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println();
  Serial.print("Connecting to WiFi");
  int tries = 0;
  while (WiFi.status() != WL_CONNECTED && tries < 40) {
    delay(250);
    Serial.print(".");
    tries++;
  }
  if(WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected! IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWiFi connect failed - check credentials.");
  }

  server.on("/", handleRoot);
  server.on("/data", handleData);
  server.begin();
  Serial.println("HTTP server started");
}

unsigned long lastRead = 0;
void loop() {
  server.handleClient();
  unsigned long now = millis();

  if(now - lastRead > 2000) { // read sensors every 2s
    lastRead = now;
    float t = dht.readTemperature();
    float h = dht.readHumidity();
    int raw = analogRead(soilPin);
    int sp = soilPercent(raw);

    Serial.print("Temp: "); Serial.print(t);
    Serial.print(" C, Hum: "); Serial.print(h);
    Serial.print(" %, Soil%: "); Serial.print(sp);
    Serial.print(" raw: "); Serial.println(raw);

    if(sp < 30) digitalWrite(ledPin, HIGH);
    else digitalWrite(ledPin, LOW);
  }
}
