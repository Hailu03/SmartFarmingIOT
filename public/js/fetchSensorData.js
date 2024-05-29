document.addEventListener('DOMContentLoaded', () => {


    async function updateSensorData(farmId) {
        try {
            const response = await fetch(`http://localhost:5000/sensorData`);
            
            const data = await response.json();
            console.log(data);
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
    }, 5000);
});


