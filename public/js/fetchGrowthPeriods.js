$(document).ready(function() {
    // Function to fetch growth periods
    async function fetchGrowthPeriods(speciesID) {
        try {
            const response = await fetch(`http://localhost:3002/api/growthPeriods?speciesID=${speciesID}`);
            const data = await response.json();
            const periodSelect = document.getElementById('periodSelect');
            periodSelect.innerHTML = ''; // Clear existing options

            data.forEach(period => {
                const option = document.createElement('option');
                option.value = period.GrowthPeriodID;
                option.textContent = period.Period; // Assuming 'PeriodName' is the name field for the period
                periodSelect.appendChild(option);
            });
        } catch (error) {
            console.error(`Error fetching growth periods: ${error.message}`);
        }
    }

    // Event listener for farm selection change
    const farmSelectElement = document.querySelector('#FarmSelect');
    farmSelectElement.addEventListener('change', function () {
        const farmId = this.value;
        fetchSpecies(farmId);
    });

    // Initial load
    const initialFarmId = farmSelectElement.value;
    fetchSpecies(initialFarmId);
});