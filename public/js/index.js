$(document).ready(function() {
    // Function to fetch data from the server
    function fetchData() {
        $.get('/api/sensor-data/:1', function(data) {
            // Update the content of the page with the fetched data
            $('#temperature').text(data.temperature || 'N/A');
            $('#airHumidity').text(data.airHumidity || 'N/A');
            $('#soilHumidity').text(data.soilHumidity || 'N/A');
            $('#luminosity').text(data.luminosity || 'N/A');
            $('#pHLevel').text(data.pHLevel || 'N/A');
            $('#wind').text(data.wind || 'N/A');
        });
    }

    // Fetch data initially when the page loads
    fetchData();

    // Fetch data periodically every 5 seconds
    setInterval(fetchData, 5000); // Adjust the interval as needed
});