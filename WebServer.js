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
    res.send('Data received and stored successfully');
  } catch (error) {
    console.error('Error inserting data into the database', error.stack);
    res.status(500).send('Server error');
  }

});

// Route to render the index view
app.get('/', function (req, res) {
  res.render('index');
});



// Route to provide sensor data as JSON
app.get(`/sensorData`, (req, res) => {
  res.json(sensorData);
})

//Route for publishing mqtt message
app.post('/publish', (req, res) => {
  const { message } = req.body;
  if (message) {
    client.publish(topic, message, () => {
      console.log('Message published:', message);
      res.send('Message published successfully');
    });
  } else {
    res.status(400).send('Message is required');
  }
});

app.listen(port, () => {
  console.log(`SERVER IS OPEN ON PORT ${port}`);
})


