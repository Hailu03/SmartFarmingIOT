const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

let sensorData = {};

const app = express();

const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/data', (req, res) => {
    sensorData = req.body;
    console.log('Received data:', sensorData);
});

app.get('/api/data', (req, res) => {
    res.json(sensorData);
});

app.listen(port, () => {
    console.log(`SERVER IS OPEN ON PORT ${port}`);
});