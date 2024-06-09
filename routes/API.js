const express = require('express');
const router = express.Router();
const { insertSensor,queryDb, fetchGrowthPeriods,fetchSpecies,queryFarmID,retrieveOptimalValue } = require('../model/query.js');

let sensorData = {};

// MQTT setup
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://test.mosquitto.org');
const topic = 'SmartFarmingProject-SGVT';

//function to make comparisons and send mqtt messages
async function processSensorData(FarmID, sensorData) {
    const { Temperature, AirHumidity, SoilHumidity, Luminosity, PHLevel, WindSpeed } = sensorData;
  
    try {
        // Retrieve the species for the given farm
        const speciesResult = await queryFarmID(FarmID);
        const SpeciesID = speciesResult[0].SpeciesID;
  
        // Retrieve the optimal values from the knowledge base
        const optimalValues = await retrieveOptimalValue(SpeciesID);
    
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
            else actionMessage = 'Deactivate wind barriers or increase ventilation';
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

// Route to handle incoming sensor data
router.post('/data', async (req, res) => {
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
      await processSensorData(FarmID, sensorData);
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
  const { farmId } = req.query;
  try {
      const data = await queryDb(farmId);
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