const express = require('express');
const router = express.Router();
const { insertSensor,queryDb, fetchGrowthPeriods,fetchSpecies } = require('../model/query.js');

let sensorData = {};

// Route to handle incoming sensor data
router.post('/data', async (req, res) => {
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

// Route to provide sensor data as JSON
router.get('/sensorData', (req, res) => {
    res.json(sensorData);
  });

// Route to handle sensor data query
router.get('/getall', async (req, res) => {
const { column, farmId } = req.query; // Extract column and value from query parameters
try {
    // console.log(column,FarmId);
    data = await queryDb(column,farmId); // Call the query function with provided column and value
    res.json(data);
} catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Server error');
}
});

router.get('/species', async (req, res) => {
    try {
        const { farmID } = req.query;
        species = await fetchSpecies(farmID);
        res.json(species);
    } catch (error) {
        console.error('Error fetching species:', error);
        res.status(500).send('Server error');
    }
});

router.get('/growthPeriods', async (req, res) => {
    const { speciesID } = req.query;
    try {
        const growthPeriods = await fetchGrowthPeriods(speciesID);
        res.json(growthPeriods);
    } catch (error) {
        console.error('Error fetching growth periods:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;