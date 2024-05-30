const express = require('express');
const bodyParser = require('body-parser');
const { insertSensor } = require('./model/query.js');

var mqtt = require('mqtt');
const path = require('path');

var mqttClient = mqtt.connect('mqtt://test.mosquitto.org')
var topic = 'SmartFarmingProject-SGVT'

const app = express();
const port = 5000;
let sensorData = {};

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

// Set up a simple web server 
app.set('view engine', 'ejs');

// Route to handle incoming sensor data
app.post('/api/data', async (req, res) => {
  sensorData = req.body;
  const { FarmID, Temperature, AirHumidity, SoilHumidity, Luminosity, PHLevel, WindSpeed } = sensorData;
  const timestamp = new Date().toISOString();

  try {
    const result = await insertSensor(FarmID, timestamp, AirHumidity, SoilHumidity, Luminosity, PHLevel, Temperature, WindSpeed);
    if (result) {
        console.log('Data inserted successfully');
        res.status(200).send('Data inserted successfully');
    } else {
        res.status(500).send('Failed to insert data');
    }
  } catch (error) {
      console.error('Error inserting data into the database:', error);
      res.status(500).send('Server error');
  }

  console.log('Received data:', sensorData);
});

// Route to render the index view
app.get('/', function (req, res) {
  res.render('index');
});

// Route to provide sensor data as JSON
app.get('/sensorData', (req, res) => {
  res.json(sensorData);
});

app.listen(port, () => {
  console.log(`SERVER IS OPEN ON PORT ${port}`);
});
