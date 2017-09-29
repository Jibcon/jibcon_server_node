var express = require('express');
var router = express.Router();
var mqtt = require('mqtt');
var http = require('http');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var promise = require('promise');
var FCM = require('fcm-push');
var _ = require('underscore');
var async = require('async');
var serverKey = 'AAAA7Lx5bLQ:APA91bHMHOpGYBbCnK2kVZJtPv5erQKsnMIuaQJ6WLAxZvnrBdNR6l9jv1moTjumJq70jp9a5fL9ow5KKE_-D17eGCkBV_-HW9zLTnlmzVx48QUs49V9LJiOAqzdYHyCMH1r-8yTjdk0';
var fcm = new FCM(serverKey);
var pushMessage = {
    to: 'crnWU93JgDc:APA91bE7GxkA8QUwSJQwFhauOMYRS9ltUngMOI41ThI-VK5ij9GkOI1yZE4eKkuntpgdAxa-HLGPRoonXMHz-26rMbELh_t58iDagUcHKZDvRMEXfmsqtFV3MyglOrQNypUmf1PirjDV', // required fill with device token or topics
    data: {
        your_custom_data_key: 'your_custom_data_value'
    },
    notification: {
        title: 'Jibcon',
        body: ''
    }
};

var mqttUrl = "mqtt://52.79.180.194";


const subscriptionData = {
    "m2m:sub": {
        "rn": '',//subscription 이름이 됨
        "enc": {
            "net": [1, 3, 4]
        },
        "nu": [],
        "nct": 2,
        "pn": 1
    }
};
const httpRequestOptions = {
    hostname: '52.79.180.194',
    port: 7579,
    path: '/Mobius',
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'X-M2M-RI': '12345',
        'X-M2M-Origin': 'aei-jibcon',
        'Content-Type': 'application/json;ty=23'
    }
}


function mqttAddSubscription(subscribtionTopic) {
    console.log('topic : ' + subscribtionTopic);
    console.log('start');
    var mqttClient = mqtt.connect(mqttUrl);
    mqttClient.on('connect', () => {
        console.log('??');
        console.log(subscribtionTopic);
        mqttClient.subscribe(subscribtionTopic);
        console.log('connect to ' + subscribtionTopic);
    });
    mqttClient.on('message', (topic, message) => {
        if (topic == subscribtionTopic) {
            var m2m = JSON.parse(message).pc.sgn.nev.rep;
            m2m = m2m[`m2m:cin`];
            console.log(m2m.con);
            pushMessage.notification.body = m2m.con;
            fcmMessageSending(pushMessage);
        }

    });
    console.log('end');

}

function deleteSubscription(req, res, aeName, cntName, subName) {

    var option = JSON.parse(JSON.stringify(httpRequestOptions));
    option.path = option.path + '/' + aeName + '/' + cntName + '/' + subName;
    option.method = 'DELETE';
    var httpReq = http.request(option, (httpRes) => {

        console.log(`STATUS: ${httpRes.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(httpRes.headers)}`);
        httpRes.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);

        });
        httpRes.on('end', () => {
            console.log('No more data in response.');
            res.status(201).end();
        });


    });
    httpReq.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    //httpReq.write(JSON.stringify(subData));
    httpReq.end();
}


function fcmMessageSending(pushMessage) {

    fcm.send(pushMessage, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}


router.post('/addSub', (req, res) => {


    var option = JSON.parse(JSON.stringify(httpRequestOptions));
    var subData = JSON.parse(JSON.stringify(subscriptionData));

    option.path = httpRequestOptions.path + '/' + req.body.aeName + '/' + req.body.cntName;
    subData[`m2m:sub`].rn = req.body.subName;
    subData[`m2m:sub`].nu = [mqttUrl + '/' + req.body.subName];

    console.log(option);
    console.log(subData);

    var httpReq = http.request(option, (httpRes) => {

        console.log(`STATUS: ${httpRes.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(httpRes.headers)}`);
        httpRes.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            //    todo addsubscription부터
            mqttAddSubscription(req.body.topic);

        });
        httpRes.on('end', () => {
            console.log('No more data in response.');
            res.status(201).end();
        });


    });
    httpReq.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });
    //console.log(httpReq);
// write data to request body
    httpReq.write(JSON.stringify(subData));
    httpReq.end();
});


router.post('/deleteSub', (req, res) => {
    deleteSubscription(req, res,req.body.aeName, req.body.cntName, req.body.subName);
    res.status(201).end();
});

//mqttInitialization();
//connectMqtt();
//
// function connectMqtt() {
//
//     var client = mqtt.connect('mqtt://52.79.180.194');
//     client.on('connect', () => {
//         client.subscribe('/oneM2M/req/Mobius/aei-jibcon_test2/#');
//         //subscribe 는 subscription 이름대로.
//
//         console.log('mqtt connect');
//     });
//     client.on('message', (topic, message) => {
//         switch (topic) {
//             case '/oneM2M/req/Mobius/aei-jibcon_test2/json' : //oneM2M/req/Mobius/subscription이름
//                 var m2m = JSON.parse(message).pc.sgn.nev.rep;
//                 m2m = m2m[`m2m:cin`];
//                 console.log(m2m.con);
//                 pushMessage.notification.body = m2m.con;
//                 fcmMessageSending(pushMessage);
//         }
//     });
// }

module.exports = router;