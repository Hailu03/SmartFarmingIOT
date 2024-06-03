const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');


const app = express();
const port = 5000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse JSON bodies
app.use(bodyParser.json());

const APIrouter = require('./routes/API.js');
const Viewrouter = require('./routes/View.js');
app.use('/api', APIrouter);
app.use('/', Viewrouter);

// Set up a simple web server 
app.set('view engine', 'ejs');


// Route to render the index view
app.get('/', function (req, res) {
  res.render('index');
});

// Route to provide sensor data as JSON
app.get(`/sensorData`, (req, res) => {
  res.json(sensorData);
})

app.listen(port, () => {
  console.log(`SERVER IS OPEN ON PORT ${port}`);
});
