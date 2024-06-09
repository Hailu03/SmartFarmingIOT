document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('timestamp').textContent = new Date().toISOString().split('T')[0] + ' ' + new Date().toISOString().split('T')[1].split('.')[0];

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


