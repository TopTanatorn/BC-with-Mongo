const mqtt = require("mqtt");
const {Blockchain, Block} = require('./blockchain');
const MQTT_SERVER = "192.168.0.164";
const MQTT_PORT = "1883";
//if your server don't have username and password let blank.
const MQTT_USER = ""; 
const MQTT_PASSWORD = "";
let iotChain = new Blockchain();
iotChain.createGenesisBlock();
// Connect MQTT
var client = mqtt.connect({
    host: MQTT_SERVER,
    port: MQTT_PORT,
    username: MQTT_USER,
    password: MQTT_PASSWORD
});

client.on('connect', function () {
    // Subscribe any topic
    console.log("MQTT Connect");
    client.subscribe("#", function (err) {
        if (err) {
            console.log(err);
        }
    });
});

// Receive Message and print on terminal
client.on('message', function (topic, message) {
    // message is Buffer
    iotChain.addBlock(new Block(Date.now(),message));
    console.log(topic.toString());
    console.log(message.toString());
});
