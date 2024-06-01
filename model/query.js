const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "SmartFarm",
    password: "Hailuke!21092003",
    port: 5432
});

const insertSensor = async (FarmID, timestamp, AirHumidity, SoilHumidity, Luminosity, PHLevel, Temperature, WindSpeed) => {
    const client = await pool.connect(); // Get a client from the pool
    try {
        await client.query(
            `INSERT INTO "SensorData"("FarmID", "Timestamp", "AirHumidity", "SoilHumidity", "Luminosity", "PHLevel", "Temperature", "WindSpeed") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [FarmID, timestamp, AirHumidity, SoilHumidity, Luminosity, PHLevel, Temperature, WindSpeed]
        );
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    } finally {
        client.release(); // Release the client back to the pool
    }
};

const queryDb = async (column,FarmId) => {
    const client = await pool.connect(); 
    try {
        const query = `SELECT "${column}" FROM "SensorData" WHERE "FarmID" = ${FarmId}`; // Modify the query to select specific columns
        const res = await client.query(query);
        await client.end();
        return res.rows;
    } catch (error) {
        console.error(error);
    }
}

// Function to fetch species data from the database
const fetchSpecies = async (farmID) => {
    const client = await pool.connect();
    try {
        const query = `SELECT * FROM "FarmSpecies" NATURAL JOIN "Species" WHERE "FarmID" = ${farmID}`;
        const result = await client.query(query);
        await client.end();
        return result.rows;
    } catch (error) {
        console.error('Error fetching species:', error);
        throw error; // Propagate the error
    } finally {
        client.release();
    }
};

// Function to fetch growth periods based on species ID from the database
const fetchGrowthPeriods = async (speciesId) => {
    const client = await pool.connect();
    try {
        const query = `SELECT * FROM "GrowthPeriod" WHERE "SpeciesID" = $1`;
        const result = await client.query(query, [speciesId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching growth periods:', error);
        throw error; // Propagate the error
    } finally {
        client.release();
    }
};


module.exports = {
    insertSensor,
    queryDb,
    fetchSpecies,
    fetchGrowthPeriods
};