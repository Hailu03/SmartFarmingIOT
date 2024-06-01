const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// var mqtt = require('mqtt');
// var client = mqtt.connect('mqtt://test.mosquitto.org')
// var topic = 'SmartFarmingProject-SGVT'

const app = express();
const port = 5001;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse JSON bodies
app.use(bodyParser.json());

const APIrouter = require('./routes/API.js');
app.use('/api', APIrouter);


app.listen(port, () => {
  console.log(`SERVER IS OPEN ON PORT ${port}`);
});
