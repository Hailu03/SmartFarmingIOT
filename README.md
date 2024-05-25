# Members:
- Le Thanh Hai (Project Management)
- Trinh The Hao (Backend Developer)
- Pham Minh Hieu (Restful API + MQTT)
- Vu Ngoc Quang (Frontend Developer)
- Nguyen Hoang Khoi (Frontend Developer)

# Smart Farming IoT

Smart Farming IoT is an Internet of Things (IoT) application designed to monitor and manage various environmental parameters for a smart farm. The system collects sensor data such as temperature, air humidity, soil humidity, luminosity, pH level, and wind speed, and displays it on a web interface in real-time.

## Features

- Real-time monitoring of environmental parameters.
- Automatic data updates on the web interface.
- Data storage using PostgreSQL.
- RESTful API for receiving sensor data.
- Web interface built with Express and EJS.

## Folder Structure
```plaintext
SmartFarmingIOT/
├── node_modules/             # Installed dependencies (generated by npm)
│   ├── model/
│   └── query.js              # Database connection and queries
├── public/
│   └── css/
│   └── js/
│       └── index.js          # JavaScript for fetching and displaying sensor data
├── views/
│   └── index.ejs             # EJS template for the web interface
├── WebServer.js              # Main server file with Express setup and routes
├── sensor/
│   └── devices.js            # Control device to better adapt to growth
│   └── sensors.js            # Post all sensors to the server
├── package.json              # Node.js project metadata and dependencies
├── package-lock.json         # Locked versions of dependencies
└── README.md                 # Project documentation
```