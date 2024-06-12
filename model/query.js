const { Pool } = require('pg');


const primaryPool = new Pool({
    user: "The Hao",
    host: "localhost", // Update this if your primary server is on a different host
    database: "postgres",
    password: "Anhhao@2003",
    port: 5433 // Port for primary_db
});

const replicaPool = new Pool({
    user: "repuser",
    host: "localhost", // Update this if your replica server is on a different host
    database: "postgres",
    password: "Anhhao@2003",
    port: 5434 // Port for replica_db
});


// Function to insert sensor data (write operation) - Use primary pool
const insertSensor = async (FarmID, timestamp, AirHumidity, SoilHumidity, Luminosity, PHLevel, Temperature, WindSpeed) => {
    const client = await primaryPool.connect();
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
        client.release();
    }
};

// Function to query sensor data (read operation) - Use replica pool
const queryDb = async (FarmId) => {
    const client = await replicaPool.connect();
    try {
        const query = `SELECT "Timestamp", "AirHumidity", "SoilHumidity", "Luminosity", "PHLevel", "Temperature", "WindSpeed" FROM "SensorData" WHERE "FarmID" = $1`;
        const res = await client.query(query, [FarmId]);
        return res.rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Function to fetch species data (read operation) - Use replica pool
const fetchSpecies = async (farmID) => {
    const client = await replicaPool.connect();
    try {
        const query = `SELECT * FROM "FarmSpecies" NATURAL JOIN "Species" WHERE "FarmID" = ${farmID}`;
        const result = await client.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching species:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Function to fetch growth periods (read operation) - Use replica pool
const fetchGrowthPeriods = async (speciesId) => {
    const client = await replicaPool.connect();
    try {
        const query = `SELECT * FROM "GrowthPeriod" WHERE "SpeciesID" = $1`;
        const result = await client.query(query, [speciesId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching growth periods:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Function to query farm species IDs (read operation) - Use replica pool
const queryFarmID = async (FarmID) => {
    const client = await replicaPool.connect();
    try {
        const query = `SELECT "SpeciesID" FROM "FarmSpecies" WHERE "FarmID" = $1`;
        const result = await client.query(query, [FarmID]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching farm:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Function to retrieve optimal values (read operation) - Use replica pool
const retrieveOptimalValue = async (speciesID) => {
    const client = await replicaPool.connect();
    try {
        const query = `SELECT "ParameterName", "MinValue", "MaxValue" FROM "KnowledgeBase" WHERE "SpeciesID" = $1`;
        const result = await client.query(query, [speciesID]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching optimal values:', error);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    insertSensor,
    queryDb,
    fetchSpecies,
    fetchGrowthPeriods,
    queryFarmID,
    retrieveOptimalValue
};
