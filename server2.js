const express = require('express');
const bodyParser = require('body-parser');
const { queryFarmID,retrieveOptimalValue } = require('./model/query.js');

const app = express();

const port = 3001;

app.use(bodyParser.json());

// MQTT setup
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://test.mosquitto.org');
const topic = 'SmartFarmingProject-SGVT';


app.post('/data', async (req, res) => {
    let sensorData = req.body;
    try {
        await processSensorData(sensorData);
        res.status(200).send('Data processed successfully');
    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).send('Server error');
    }
});


//function to make comparisons and send mqtt messages
async function processSensorData(sensorData) {
    const { FarmID, Temperature, AirHumidity, SoilHumidity, Luminosity, PHLevel, WindSpeed } = sensorData;
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

app.listen(port, () => {
    console.log(`SERVER IS OPEN ON PORT ${port}`);
});
