$(document).ready(function () {
    const ctx = document.getElementById('sensorChart').getContext('2d');
    let sensorChart;
    let farmId;

    // Function to fetch sensor data from the server
    async function fetchSensorData() {
        try {
            const response = await fetch(`http://localhost:3002/api/getall?farmId=${farmId}`);
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            throw new Error(`Error fetching sensor data: ${error.message}`);
        }
    }

    // Function to update the chart with multiple datasets
    function updateChart(data) {
        // if (sensorChart) {
        //     sensorChart.destroy();
        //     sensorChart = null; // Ensure the chart instance is set to null
        // }


        const slicedData = data.slice(-10); // Slice the data array to include only the last 40 elements

        const labels = slicedData.map(entry => new Date(entry.Timestamp)); // Generate labels based on the timestamp

        const datasets = [
            {
                label: 'AirHumidity',
                data: slicedData.map(entry => entry.AirHumidity),
                borderColor: 'blue',
                borderWidth: 1,
                fill: false
            },
            {
                label: 'SoilHumidity',
                data: slicedData.map(entry => entry.SoilHumidity),
                borderColor: 'green',
                borderWidth: 1,
                fill: false
            },
            {
                label: 'Luminosity',
                data: slicedData.map(entry => entry.Luminosity),
                borderColor: 'yellow',
                borderWidth: 1,
                fill: false
            },
            {
                label: 'PHLevel',
                data: slicedData.map(entry => entry.PHLevel),
                borderColor: 'purple',
                borderWidth: 1,
                fill: false
            },
            {
                label: 'Temperature',
                data: slicedData.map(entry => entry.Temperature),
                borderColor: 'red',
                borderWidth: 1,
                fill: false
            },
            {
                label: 'WindSpeed',
                data: slicedData.map(entry => entry.WindSpeed),
                borderColor: 'orange',
                borderWidth: 1,
                fill: false
            }
        ];

        console.log(labels);

        if (sensorChart) {
            sensorChart.data.labels = labels;
            sensorChart.data.datasets.forEach((dataset, index) => {
                dataset.data = datasets[index].data;
            });
            sensorChart.update();
        } else {
            sensorChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'second'
                            },
                            ticks: {
                                stepSize: 5
                            }
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    // Function to fetch sensor data and update the chart
    async function fetchDataAndUpdateChart() {
        try {
            const data = await fetchSensorData();
            updateChart(data);
        } catch (error) {
            console.error(error.message);
        }
    }

    $('#FarmSelect').change(function () {
        farmId = $(this).val();
        fetchDataAndUpdateChart();
    });

    // Initial load
    farmId = $('#FarmSelect').val();
    fetchDataAndUpdateChart();

    // Fetch sensor data and update the chart every 5 seconds
    setInterval(() => {
        fetchDataAndUpdateChart();
    }, 3000);
});
