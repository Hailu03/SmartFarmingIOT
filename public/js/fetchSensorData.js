document.addEventListener('DOMContentLoaded', () => {
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

    document.getElementById('timestamp').textContent = vietnamTimeNow.replace(',', '');

    async function updateSensorData(farmId) {
        try {
            const response = await fetch(`http://localhost:3000/api/data`);
            const data = await response.json();

            if(data.FarmID == farmId){
                document.getElementById('temperature').textContent = data.Temperature;
                document.getElementById('airHumidity').textContent = data.AirHumidity;
                document.getElementById('soilHumidity').textContent = data.SoilHumidity;
                document.getElementById('luminosity').textContent = data.Luminosity;
                document.getElementById('pHLevel').textContent = data.PHLevel;
                document.getElementById('wind').textContent = data.WindSpeed;
            }
        } catch (error) {
            console.error('Error fetching sensor data:', error);
        }
    }

    const farmSelectElement = document.querySelector('#FarmSelect');
    farmSelectElement.addEventListener('change', function () {
        const farmId = this.value;
        updateSensorData(farmId);
    });

    // Initial load
    const initialFarmId = farmSelectElement.value;
    updateSensorData(initialFarmId);

    setInterval(() => {
        updateSensorData(farmSelectElement.value);
    }, 500);
});


