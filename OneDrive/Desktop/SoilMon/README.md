# Soil Monitoring Dashboard

A beautiful web dashboard for monitoring soil quality using ESP8266 sensors.

## Features

- 🌱 Real-time soil quality monitoring
- 🌡️ Temperature and humidity tracking
- 💧 Soil moisture percentage display
- 🎨 Beautiful green and white gradient theme
- ⚠️ Alert popups when soil quality drops
- 📱 Responsive design for all devices

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- ESP8266 with sensors connected and running the provided Arduino code

## Installation

1. Install dependencies:
```bash
npm install
```

2. Update the ESP8266 IP address in `server.js`:
   - Open `server.js`
   - Find the line: `const ESP8266_IP = '192.168.1.100';`
   - Replace with your ESP8266's actual IP address (check Serial Monitor when ESP8266 connects)

3. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
SoilMon/
├── server.js              # Node.js Express server
├── package.json           # Dependencies and scripts
├── views/
│   └── index.ejs         # Main dashboard template
├── public/
│   ├── css/
│   │   └── style.css     # Dashboard styles
│   └── js/
│       └── script.js     # Client-side JavaScript
├── images/
│   ├── happy.png         # Best soil quality
│   ├── neutral.png       # Normal soil quality
│   └── cry.png          # Poor soil quality
└── plantpal_code.ino    # Arduino code for ESP8266
```

## How It Works

1. The ESP8266 reads sensor data (temperature, humidity, soil moisture) and serves it via HTTP at `/data` endpoint
2. The Node.js server fetches data from ESP8266 and serves the dashboard
3. The dashboard automatically updates every 3 seconds
4. When soil moisture drops below 30%, an alert popup appears
5. Images change based on soil quality:
   - **happy.png**: Soil moisture ≥ 60% (Excellent)
   - **neutral.png**: Soil moisture 30-59% (Normal)
   - **cry.png**: Soil moisture < 30% (Poor)

## Configuration

### Alert Threshold
You can change the alert threshold in `public/js/script.js`:
```javascript
const ALERT_THRESHOLD = 30; // Change this value
```

### Update Interval
Change how often the dashboard updates in `public/js/script.js`:
```javascript
const UPDATE_INTERVAL = 3000; // Milliseconds (3000 = 3 seconds)
```

## Troubleshooting

- **Cannot connect to ESP8266**: Make sure the IP address in `server.js` matches your ESP8266's IP
- **No data showing**: Check that ESP8266 is connected to WiFi and the `/data` endpoint is accessible
- **Images not loading**: Ensure the `images` folder is in the project root

## License

ISC

