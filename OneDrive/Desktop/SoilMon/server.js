const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// ESP8266 IP address - UPDATE THIS with your ESP8266's IP
// You can find it in the Serial Monitor when ESP8266 connects to WiFi
const ESP8266_IP = '192.168.1.100'; // Change this to your ESP8266's IP address

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (images, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Middleware to parse JSON
app.use(express.json());

// Function to determine soil quality status
function getSoilQuality(soilPercent) {
  if (soilPercent >= 60) {
    return { status: 'excellent', image: 'happy.png', message: 'Excellent soil quality!' };
  } else if (soilPercent >= 30) {
    return { status: 'normal', image: 'neutral.png', message: 'Normal soil quality' };
  } else {
    return { status: 'poor', image: 'cry.png', message: 'Poor soil quality - needs attention!' };
  }
}

// Route to fetch data from ESP8266
app.get('/api/data', async (req, res) => {
  try {
    const response = await axios.get(`http://${ESP8266_IP}/data`, {
      timeout: 5000
    });
    
    const data = response.data;
    const soilQuality = getSoilQuality(data.soil_percent);
    
    res.json({
      ...data,
      soilQuality: soilQuality.status,
      soilImage: soilQuality.image,
      soilMessage: soilQuality.message
    });
  } catch (error) {
    console.error('Error fetching data from ESP8266:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch data from ESP8266',
      message: 'Make sure ESP8266 is connected and IP address is correct'
    });
  }
});

// Main dashboard route
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`http://${ESP8266_IP}/data`, {
      timeout: 5000
    });
    
    const data = response.data;
    const soilQuality = getSoilQuality(data.soil_percent);
    
    res.render('index', {
      temperature: data.temperature,
      humidity: data.humidity,
      soilPercent: data.soil_percent,
      soilRaw: data.soil_raw,
      soilQuality: soilQuality.status,
      soilImage: soilQuality.image,
      soilMessage: soilQuality.message,
      esp8266IP: ESP8266_IP
    });
  } catch (error) {
    console.error('Error fetching initial data:', error.message);
    // Render with error state
    res.render('index', {
      temperature: null,
      humidity: null,
      soilPercent: null,
      soilRaw: null,
      soilQuality: 'error',
      soilImage: 'neutral.png',
      soilMessage: 'Unable to connect to ESP8266',
      esp8266IP: ESP8266_IP,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🌱 Soil Monitoring Dashboard running on http://localhost:${PORT}`);
  console.log(`📡 Make sure ESP8266 is accessible at http://${ESP8266_IP}/data`);
  console.log(`⚠️  Update ESP8266_IP in server.js if needed`);
});

