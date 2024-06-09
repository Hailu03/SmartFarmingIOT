const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const { insertSensor,queryDb, fetchGrowthPeriods,fetchSpecies } = require('./model/query.js');


const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3002;

let sensorData = {};

app.post('/api/data', async (req, res) => {
    sensorData = req.body;
    const { FarmID, Temperature, AirHumidity, SoilHumidity, Luminosity, PHLevel, WindSpeed } = sensorData;

    const vietnamTimeZone = 'Asia/Ho_Chi_Minh';

    // Get the current timestamp
    const currentTimeStamp = new Date();

    // Get the options for formatting the time
    const formattedTimeStamp = currentTimeStamp.toLocaleString('en-US', {
        timeZone: vietnamTimeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(/\//g, '-'); // Replace slashes with dashes for consistency

    // Format the timestamp to display in Vietnam time
    const vietnamTimeNow = currentTimeStamp.toLocaleString('en-US', formattedTimeStamp);
    console.log(vietnamTimeNow)
  
    try {
        const result = await insertSensor(FarmID, vietnamTimeNow, AirHumidity, SoilHumidity, Luminosity, PHLevel, Temperature, WindSpeed);
        if (result) {
            console.log('Data inserted successfully');
            res.status(200).send('Data inserted successfully');

            // forward the sensor data to the next service
            axios.post('http://localhost:3000/data', sensorData)
                .then(response => {
                    console.log('Data forwarded to the next service');
                })
                .catch(error => {
                    console.error('Error forwarding data to the next service:', error);
                });

            // forward the sensor data to the next service
            axios.post('http://localhost:3001/data', sensorData)
                .then(response => {
                    console.log('Data forwarded to the next service');
                })
                .catch(error => {
                    console.error('Error forwarding data to the next service:', error);
                });
        } else {
            res.status(500).send('Failed to insert data');
        }
    } catch (error) {
        console.error('Error inserting data into the database:', error);
        res.status(500).send('Server error');
    }
  
    console.log('Received data:', sensorData);
});

// Route to handle sensor data query
app.get('/api/getall', async (req, res) => {
    const { farmId } = req.query;
    try {
        const data = await queryDb(farmId);
        res.json(data);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Server error');
    }
});
  
app.get('/api/species', async (req, res) => {
    try {
        const { farmID } = req.query;
        species = await fetchSpecies(farmID);
        res.json(species);
    } catch (error) {
        console.error('Error fetching species:', error);
        res.status(500).send('Server error');
    }
});
  
app.get('/api/growthPeriods', async (req, res) => {
    const { speciesID } = req.query;
    try {
        const growthPeriods = await fetchGrowthPeriods(speciesID);
        res.json(growthPeriods);
    } catch (error) {
        console.error('Error fetching growth periods:', error);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`SERVER IS OPEN ON PORT ${port}`);
});