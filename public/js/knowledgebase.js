$(document).ready(function() {
    const minValues = {
        luminosity: 100, // example values
        temperature: 18,
        soilHumidity: 30,
        airHumidity: 40,
        pHLevel: 6,
        windSpeed: 5
    };

    const maxValues = {
        luminosity: 300, // example values
        temperature: 25,
        soilHumidity: 60,
        airHumidity: 70,
        pHLevel: 7.5,
        windSpeed: 20
    };

    function updateControlFrame(sensorType, value) {
        let action = 'Normal';
        if (value < minValues[sensorType]) {
            console.log(sensorType, value,minValues[sensorType]);
            if (sensorType == 'luminosity') action = 'Turn on the light';
            if (sensorType == 'temperature') action = 'Turn off the fan or air conditioner';
            if (sensorType == 'soilHumidity') action = 'Turn on the water pump';
            if (sensorType == 'airHumidity') action = 'Activate humidifier';
            if (sensorType == 'pHLevel') action = 'Add alkaline solution';
        } else if (value > maxValues[sensorType]) {
            if (sensorType == 'luminosity') action = 'Turn off the light';
            if (sensorType == 'temperature') action = 'Turn on the fan or air conditioner';
            if (sensorType == 'soilHumidity') action = 'Turn off the water pump';
            if (sensorType == 'airHumidity') action = 'Activate dehumidifier';
            if (sensorType == 'pHLevel') action = 'Add acidic solution';
            if (sensorType == 'windSpeed') action = 'Activate wind barriers or reduce ventilation';
        } 
        
        $(`#${sensorType}Value`).text(value);
        $(`#${sensorType}Action`).text(action);
    }

    // Example function to fetch sensor data, you would replace this with actual data fetching logic
    function fetchSensorData() {
        return {
            luminosity: 90, // example values
            temperature: 22,
            soilHumidity: 45,
            airHumidity: 55,
            pHLevel: 7,
            windSpeed: 10
        };
    }

    // Update the control frames initially and then periodically
    function updateControlFrames() {
        const sensorData = fetchSensorData();
        updateControlFrame('luminosity', sensorData.luminosity);
        updateControlFrame('temperature', sensorData.temperature);
        updateControlFrame('soilHumidity', sensorData.soilHumidity);
        updateControlFrame('airHumidity', sensorData.airHumidity);
        updateControlFrame('pHLevel', sensorData.pHLevel);
        updateControlFrame('windSpeed', sensorData.windSpeed);
    }

    updateControlFrames();
    setInterval(updateControlFrames, 5000); // Update every 5 seconds
});