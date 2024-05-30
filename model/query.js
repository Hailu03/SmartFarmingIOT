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

module.exports = {
    insertSensor
};
