const express = require('express');
const bodyParser = require('body-parser');
var mqtt = require('mqtt')
const path = require('path');
const { Pool } = require('pg');

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "Project",
  password: "@MHlqd2003",
  port: 5432
};

const pool = new Pool(credentials);
pool.connect()
  .then(() => {
    console.log('CONNECT TO DB SUCCESSFULLY');
  })
  .catch((err) => {
    console.log(err);
  })

var client = mqtt.connect('mqtt://test.mosquitto.org')
var topic = 'SmartFarmingProject-SGVT'

const app = express();
const port = 5000;
let sensorData = {};  // Make sure sensorData is defined

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

// Set up a simple web server 
app.set('view engine', 'ejs');

// Route to handle incoming sensor data
app.post('/api/data', async (req, res) => {
  sensorData = req.body; // Store the received sensor data
  const { FarmID, Temperature, AirHumidity, SoilHumidity, Luminosity, PHLevel, WindSpeed } = sensorData;
  const timestamp = new Date().toISOString();

  console.log('Received data:', sensorData);
  try {
    await pool.query(
      `INSERT INTO "SensorData"("FarmID", "Timestamp", "AirHumidity", "SoilHumidity", "Luminosity", "PHLevel", "Temperature", "WindSpeed") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [FarmID, timestamp, AirHumidity, SoilHumidity, Luminosity, PHLevel, Temperature, WindSpeed]
    );

    await processSensorData(FarmID, sensorData);
    res.send('Data received, stored and processed successfully');

  } catch (error) {
    console.error('Error inserting data into the database', error.stack);
    res.status(500).send('Server error');
  }

});

//function to make comparisons and send mqtt messages
async function processSensorData(FarmID, sensorData) {
  const { Temperature, AirHumidity, SoilHumidity, Luminosity, PHLevel, WindSpeed } = sensorData;

  try {
    // Retrieve the species for the given farm
    const speciesResult = await pool.query(`SELECT "SpeciesID" FROM "FarmSpecies" WHERE "FarmID" = $1`, [FarmID]);
    const SpeciesID = speciesResult.rows[0].SpeciesID;

    // Retrieve the optimal values from the knowledge base
    const optimalValuesResult = await pool.query(`SELECT "ParameterName", "MinValue", "MaxValue" FROM "KnowledgeBase" WHERE "SpeciesID" = $1`, [SpeciesID]);
    const optimalValues = optimalValuesResult.rows;

    // Compare sensor data with optimal values and send MQTT messages
    optimalValues.forEach(optimalValue => {
      const { ParameterName, MinValue, MaxValue } = optimalValue;
      let actionMessage = '';

      switch (ParameterName) {
        case 'Luminosity':
          if (Luminosity < MinValue) actionMessage = 'Turn on the light';
          else if (Luminosity > MaxValue) actionMessage = 'Turn off the light';
          break;
        case 'Temperature':
          if (Temperature < MinValue) actionMessage = 'Turn off the fan or air conditioner';
          else if (Temperature > MaxValue) actionMessage = 'Turn on the fan or air conditioner';
          break;
        case 'SoilHumidity':
          if (SoilHumidity < MinValue) actionMessage = 'Turn on the water pump';
          else if (SoilHumidity > MaxValue) actionMessage = 'Turn off the water pump';
          break;
        case 'AirHumidity':
          if (AirHumidity < MinValue) actionMessage = 'Activate humidifier';
          else if (AirHumidity > MaxValue) actionMessage = 'Activate dehumidifier';
          break;
        case 'PHLevel':
          if (PHLevel < MinValue) actionMessage = 'Add alkaline solution';
          else if (PHLevel > MaxValue) actionMessage = 'Add acidic solution';
          break;
        case 'WindSpeed':
          if (WindSpeed > MaxValue) actionMessage = 'Activate wind barriers or reduce ventilation';
          break;
        default:
          break;
      }

      if (actionMessage) {
        client.publish(topic, actionMessage, () => {
          console.log('Published message:', actionMessage);
        });
      }
    });

  } catch (error) {
    console.error('Error processing sensor data:', error);
  }
}

// Route to render the index view
app.get('/', function (req, res) {
  res.render('index');
});



// Route to provide sensor data as JSON
app.get(`/sensorData`, (req, res) => {
  res.json(sensorData);
})

// //Route for publishing mqtt message
// app.post('/publish', (req, res) => {
//   const { message } = req.body;
//   if (message) {
//     client.publish(topic, message, () => {
//       console.log('Message published:', message);
//       res.send('Message published successfully');
//     });
//   } else {
//     res.status(400).send('Message is required');
//   }
// });

app.listen(port, () => {
  console.log(`SERVER IS OPEN ON PORT ${port}`);
})


