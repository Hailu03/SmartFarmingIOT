const { Client } = require('pg');

const credentials = {
    user: "postgres",
    host: "localhost",
    database: "Farming_Project",
    password: "Matkhau12345",
    port: 5433
};

const client = new Client(credentials);

const connectDb = async () => {
    try {
        await client.connect();
        const res = await client.query("SELECT * FROM sensor");
        await client.end();
    } catch (error) {
        console.log(error);
    }
};

// connectDb();

const insertSensor = async (timestamp, temperature, luminosity, airHumidity, soilHumidity) => {
    try {
        await client.connect();
        await client.query(
            "INSERT INTO sensor (timestamp, temperature, luminosity, air_humidity, soil_humidity) VALUES($1,$2,$3,$4,$5)",
            [timestamp, temperature, luminosity, airHumidity, soilHumidity]
        );
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    } finally {
        await client.end();
    }
};

// Corrected function call
// insertSensor(new Date().toISOString(), 25, 15, 45, 65).then(result => {
//     if (result) {
//         console.log('data inserted');
//     }
// });

const queryDb = async (tab, val) => {
    try {
        const query = "SELECT * from " + tab + " WHERE temperature = $1"
        await client.connect();
        const values = [val]
        const res = await client.query(query, values)
        console.log(res)
    await client.end()
    } catch (error) {
    console.log(error)
    }
}

// queryDb('sensor', 25)
