
$(document).ready(function() {
    const client = mqtt.connect('wss://test.mosquitto.org:8081');
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
        console.log(`Received message on ${topic}: ${message}`)
        const msg = message.toString();
        let sensorType = '';
        let action = msg;

        switch (msg) {
            case 'Turn on the light':
            case 'Turn off the light':
                sensorType = 'luminosity';
                break;
            case 'Turn off the fan or air conditioner':
            case 'Turn on the fan or air conditioner':
                sensorType = 'temperature';
                break;
            case 'Turn on the water pump':
            case 'Turn off the water pump':
                sensorType = 'soilHumidity';
                break;
            case 'Activate humidifier':
            case 'Activate dehumidifier':
                sensorType = 'airHumidity';
                break;
            case 'Add alkaline solution':
            case 'Add acidic solution':
                sensorType = 'pHLevel';
                break;
            case 'Activate wind barriers or reduce ventilation':
            case 'Deactivate wind barriers or increase ventilation':
                sensorType = 'windSpeed';
                break;
            default:
                console.log('Unknown action:', message);
                return; // Exit the function if the message is not recognized
        }

        // Update the corresponding value and action elements
        $(`#${sensorType}Value`).text(action);
        $(`#${sensorType}Action`).text(action);
    });

    // Handle errors
    client.on('error', (err) => {
        console.error('MQTT Error:', err);
        client.end();
    });

    // Handle connection close
    client.on('close', () => {
        console.log('MQTT connection closed');
    });
});
