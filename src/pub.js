const mqtt = require("mqtt");

const MQTT_SERVER = "192.168.0.164";
const MQTT_PORT = "1883";
//if your server don't have username and password let blank.
const MQTT_USER = "";
const MQTT_PASSWORD = "";

// Connect MQTT
var client = mqtt.connect({
    host: MQTT_SERVER,
    port: MQTT_PORT,
    username: MQTT_USER,
    password: MQTT_PASSWORD
});
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
var waitForUserInput = function () {
    rl.question("Send message: ", function (msg) {
        if (msg == "exit") {
            rl.close();
        } else {
            console.log("Your mesage: "+msg);
            client.publish('room1/led1', msg)
            waitForUserInput();

        }
    });
}

waitForUserInput();








