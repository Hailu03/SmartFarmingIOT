const axios = require('axios');

const WEB_SERVER_URL = "http://localhost:5000/api/data"; // Replace with your server URL

function generateRandomSensorData() {
  return {
    FarmID: getRandomInt(1, 2),
    Temperature: getRandomInt(20, 40),      // Random temperature between 20°C and 40°C
    AirHumidity: getRandomInt(40, 60),      // Random air humidity between 40% and 60%
    SoilHumidity: getRandomInt(0, 100),     // Random soil humidity between 0% and 100%
    Luminosity: getRandomInt(0, 1000),      // Random luminosity between 0 and 1000 lux
    PHLevel: getRandomFloat(4, 8),          // Random pH level between 4 and 8
    WindSpeed: getRandomFloat(0, 10)             // Random wind speed/direction between 0 and 10 (m/s)
  };
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

async function sendSensorData() {
  const data = generateRandomSensorData();
  try {
    const response = await axios.post(WEB_SERVER_URL, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("Error sending data:", error);
  }
}

// Send data every 5 seconds
setInterval(sendSensorData, 5000);