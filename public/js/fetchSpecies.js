$(document).ready(function() {
    // Function to fetch species data
    async function fetchSpecies(farmID) {
        try {
            response = await fetch(`http://localhost:3002/api/species?farmID=${farmID}`);
            const data = await response.json();
            document.getElementById('speices').textContent = data[0].Name;
            fetchGrowthPeriods(data[0].SpeciesID);
        } catch (error) {
            console.log(`Error fetching species: ${error.message}`);
        }
    }

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

    // Fetch species and growth periods on farm change
    const farmSelectElement = document.querySelector('#FarmSelect');
    farmSelectElement.addEventListener('change', function () {
        const farmID = this.value;
        fetchSpecies(farmID);
    });

    // Initial load
    const initialFarmID = farmSelectElement.value;
    fetchSpecies(initialFarmID);
});