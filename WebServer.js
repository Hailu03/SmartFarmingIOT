const express = require('express');
const bodyParser = require('body-parser');
var mqtt = require('mqtt')
const path = require('path');


var client = mqtt.connect('mqtt://test.mosquitto.org')
var topic = 'SmartFarmingProject-SGVT'

const app = express();
const port = 5000;
let sensorData = {};  // Make sure sensorData is defined

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up a simple web server 
app.set('view engine', 'ejs');

// Route to handle incoming sensor data
app.post('/api/data', (req, res) => {
  sensorData = req.body; // Store the received sensor data
  if(sensorData.temperature > 30){
    client.publish(topic,'Turn on the fan')
  }
  console.log('Received data:', sensorData);
  // Process the data (e.g., save to database, send commands, etc.)
  res.send('Data received successfully');
});

// Route to render the index view
app.get('/', function(req, res) {
  res.render('index');
});

// Route to provide sensor data as JSON
app.get('/api/sensor-data', (req, res) => {
  res.json(sensorData);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
