const mqtt = require("mqtt");
const { Blockchain, Block } = require('./blockchain');
const MQTT_SERVER = "192.168.0.164";
const MQTT_PORT = "1883";
let i = 1;
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
let iotChain = new Blockchain();
iotChain.createGenesisBlock();
// Connect MQTT
var client = mqtt.connect({
    host: MQTT_SERVER,
    port: MQTT_PORT,

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

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    client.on('message', function (topic, message) {
        // message is Buffer
        iotChain.addBlock(new Block(Date.now(), message.toString()));
        console.log(topic.toString());
        console.log(message.toString());
        var dbo = db.db("mydb");
        
        chain = iotChain.chain[i];

        var myobj = [
            { chain },

        ];



        i = i + 1;
        dbo.collection("customers").insertMany(myobj, function (err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);

        });
    });

});