const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://test.mosquitto.org');
const topic = 'SmartFarmingProject-SGVT';

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${topic}`);
    } else {
      console.error('Failed to subscribe:', err);
    }
  });
});

client.on('message', (topic, message) => {
  
  const msg = message.toString();
  console.log(`Received message on ${topic}: ${msg}`);

  
  handleDeviceActions(msg);
});

function handleDeviceActions(message) {
  switch (message) {
    case 'Turn on the light':
      console.log('Light turned on');
      break;
    case 'Turn off the light':
      console.log('Light turned off');
      break;
    case 'Turn off the fan or air conditioner':
      console.log('Fan or air conditioner turned off');
      break;
    case 'Turn on the fan or air conditioner':
      console.log('Fan or air conditioner turned on');
      break;
    case 'Turn on the water pump':
      console.log('Water pump turned on');
      break;
    case 'Turn off the water pump':
      console.log('Water pump turned off');
      break;
    case 'Activate humidifier':
      console.log('Humidifier activated');
      break;
    case 'Activate dehumidifier':
      console.log('Dehumidifier activated');
      break;
    case 'Add alkaline solution':
      console.log('Alkaline solution added');
      break;
    case 'Add acidic solution':
      console.log('Acidic solution added');
      break;
    case 'Activate wind barriers or reduce ventilation':
      console.log('Wind barriers activated or ventilation reduced');
      break;
    case 'Deactivate wind barriers or increase ventilation':
      
    default:
      console.log('Unknown action:', message);
      break;
  }
}

// Handle errors
client.on('error', (err) => {
  console.error('MQTT Error:', err);
  client.end();
});

// Handle connection close
client.on('close', () => {
  console.log('MQTT connection closed');
});
