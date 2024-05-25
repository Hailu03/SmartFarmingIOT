var mqtt = require('mqtt')

var client = mqtt.connect('mqtt://test.mosquitto.org')
var topic = 'SmartFarmingProject-SGVT'

client.on('connect', function() {
    client.subscribe(topic);
})

client.on('message', function (topic, message) {
    console.log(message.toString());
    if(message.toString() === 'Turn on the fan'){
        console.log('Turning on the fan')
    }
})