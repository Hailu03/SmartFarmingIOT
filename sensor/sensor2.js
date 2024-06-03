const axios = require('axios');

const PRIMARY_WEB_SERVER_URL = "http://localhost:5000/api/data"; // Primary server URL
const BACKUP_WEB_SERVER_URL = "http://localhost:5001/api/data"; // Backup server URL
const MAX_RETRIES = 5; // Maximum number of retries
const RETRY_INTERVAL = 3000; // Retry interval in milliseconds (3 seconds)

function generateRandomSensorData() {
  return {
    FarmID: 2,
    Temperature: getRandomInt(20, 40),      // Random temperature between 20°C and 40°C
    AirHumidity: getRandomInt(40, 60),      // Random air humidity between 40% and 60%
    SoilHumidity: getRandomInt(0, 100),     // Random soil humidity between 0% and 100%
    Luminosity: getRandomInt(0, 1000),      // Random luminosity between 0 and 1000 lux
    PHLevel: getRandomFloat(4, 8),          // Random pH level between 4 and 8
    WindSpeed: getRandomFloat(0, 10)        // Random wind speed/direction between 0 and 10 (m/s)
  };
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

async function sendSensorData(data, retries = 0) {
  console.log("Sending data:", data);
  try {
    await axios.post(PRIMARY_WEB_SERVER_URL, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log("Data sent to primary server successfully");
  } catch (primaryError) {
    console.error("Error sending data to primary server:", primaryError);
    try {
      await axios.post(BACKUP_WEB_SERVER_URL, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Data sent to backup server successfully");
    } catch (backupError) {
      console.error("Error sending data to backup server:", backupError);
      if (retries < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_INTERVAL / 1000} seconds... (Attempt ${retries + 1}/${MAX_RETRIES})`);
        setTimeout(() => sendSensorData(data, retries + 1), RETRY_INTERVAL);
      } else {
        console.error("Failed to send data after maximum retries");
      }
    }
  }
}

function scheduleSensorDataSending() {
  const data = generateRandomSensorData();
  console.log("Sending data:", data);
  sendSensorData(data);
}

// Send data every 5 seconds
setInterval(scheduleSensorDataSending, 5000);
