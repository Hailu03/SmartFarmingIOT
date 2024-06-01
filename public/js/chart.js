$(document).ready(function () {
    const ctx = document.getElementById('sensorChart').getContext('2d');
    let sensorChart;
    let farmId;

    // Function to fetch sensor data from the server
    async function fetchSensorData(column) {
        try {
            const response = await fetch(`http://localhost:5000/api/getall?column=${column}&farmId=${farmId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(`Error fetching sensor data: ${error.message}`);
        }
    }

    // Function to update the chart based on the selected sensor type
    function updateChart(sensorType, data) {
        if (sensorChart) {
            sensorChart.destroy(); // Destroy previous chart instance
        }
        
        // Slice the data array to include only the last 40 elements
        const slicedData = data.slice(-40);
        console.log(data.length, slicedData.length)
        
        const labels = slicedData.map((entry, index) => index + 1); // Generate labels based on the index
        const values = slicedData.map(entry => entry[sensorType]); // Get values for the selected sensor type
    
        sensorChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: sensorType,
                    data: values,
                    borderColor: 'blue',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        type: 'linear',
                        ticks: {
                            stepSize: 1
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    // Function to fetch sensor data and update the chart at regular intervals
    async function fetchDataAndUpdateChart(column) {
        try {
            const data = await fetchSensorData(column);
            updateChart(column, data);
        } catch (error) {
            console.error(error.message);
        }
    }

    $('#FarmSelect').change(function () {
        farmId = $(this).val();
        fetchDataAndUpdateChart($('#sensorTypeSelect').val());
    });

    // initial load
    farmId = $('#FarmSelect').val();

    // Event listener for changes in the sensor type select box
    $('#sensorTypeSelect').change(function () {
        const selectedSensor = $(this).val();
        const column = selectedSensor; // Set the column name
        
        // Fetch sensor data and update the chart
        fetchDataAndUpdateChart(column);
    });

    // Initial load
    const initialSensor = $('#sensorTypeSelect').val();
    const initialColumn = initialSensor; // Set the initial column name
    
    // Fetch initial sensor data and update the chart
    fetchDataAndUpdateChart(initialColumn);

    // Fetch sensor data and update the chart every 5 seconds
    setInterval(() => {
        const selectedSensor = $('#sensorTypeSelect').val();
        const column = selectedSensor; // Set the column name
        fetchDataAndUpdateChart(column);
    }, 5000);
});
