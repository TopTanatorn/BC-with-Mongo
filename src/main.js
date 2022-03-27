const mqtt = require("mqtt");
const { Blockchain, Block } = require('./blockchain');
const MQTT_SERVER = "192.168.0.164";
const MQTT_PORT = "1883";
const roomTemp = "room1/temp";
const roomLdr = "room1/ldr";
const roomLed1 = "room1/led1";
const roomLed2 = "room1/led2";
var i = 1, j = 1, k = 1, l = 1, n = 0;

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";//mogodb client
let iotChainTemp = new Blockchain();//create chain
let iotChainLDR = new Blockchain();//create chain
let iotChainLED1 = new Blockchain();//create chain
let iotChainLED2 = new Blockchain();//create chain

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

MongoClient.connect(url, function (err, db) {//connect database mongo db
    if (err) throw err;

    var dbo = db.db("BC-Database");//add to colection name
    if (n === 0) {
        dbo.collection(roomTemp).insertMany([iotChainTemp.chain[0]], function (err, res) {//add block to mongodb database
            if (err) throw err;
        });
        dbo.collection(roomLdr).insertMany([iotChainLDR.chain[0]], function (err, res) {//add block to mongodb database
            if (err) throw err;
        });
        dbo.collection(roomLed1).insertMany([iotChainLED1.chain[0]], function (err, res) {//add block to mongodb database
            if (err) throw err;
        });
        dbo.collection(roomLed2).insertMany([iotChainLED2.chain[0]], function (err, res) {//add block to mongodb database
            if (err) throw err;
        });
        n = n + 1
    }

    client.on('message', function (topic, message) {//connect MQTT
        // message is Buffer
        console.time("BC-Process");

        if (topic === roomTemp) {
            iotChainTemp.addBlock(new Block(Date.now(), message.toString()));//creare block chain
            var cname = roomTemp;
            chain = iotChainTemp.chain[i];//define the current block
            i = i + 1;
        }
        else if (topic === roomLdr) {
            iotChainLDR.addBlock(new Block(Date.now(), message.toString()));//creare block chain
            var cname = roomLdr;
            chain = iotChainLDR.chain[j];//define the current block
            j = j + 1;
        }
        else if (topic === roomLed1) {
            iotChainLED1.addBlock(new Block(Date.now(), message.toString()));//creare block chain
            var cname = roomLed1;
            chain = iotChainLED1.chain[k];//define the current block
            k = k + 1;
        }
        else if (topic === roomLed2) {
            iotChainLED2.addBlock(new Block(Date.now(), message.toString()));//creare block chain
            var cname = roomLed2;
            chain = iotChainLED2.chain[l];//define the current block
            l = l + 1
        }

        console.log(topic.toString());
        console.log(message.toString());



        var myobj = [
            chain //insert chain on database

        ];


        dbo.collection(cname).insertMany(myobj, function (err, res) {//add block to mongodb database
            if (err) throw err;


        });
        console.timeEnd("BC-Process");
    });

});