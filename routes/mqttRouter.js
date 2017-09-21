var express = require('express');
var router = express.Router();
var mqtt = require('mqtt');
var http = require('http');
var querystring = require('querystring');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var FCM = require('fcm-push');

var serverKey = 'AAAA7Lx5bLQ:APA91bHMHOpGYBbCnK2kVZJtPv5erQKsnMIuaQJ6WLAxZvnrBdNR6l9jv1moTjumJq70jp9a5fL9ow5KKE_-D17eGCkBV_-HW9zLTnlmzVx48QUs49V9LJiOAqzdYHyCMH1r-8yTjdk0';
var fcm = new FCM(serverKey);

var pushMessage = {
    to: 'crnWU93JgDc:APA91bE7GxkA8QUwSJQwFhauOMYRS9ltUngMOI41ThI-VK5ij9GkOI1yZE4eKkuntpgdAxa-HLGPRoonXMHz-26rMbELh_t58iDagUcHKZDvRMEXfmsqtFV3MyglOrQNypUmf1PirjDV', // required fill with device token or topics
    data: {
        your_custom_data_key: 'your_custom_data_value'
    },
    notification: {
        title: 'Title of your push notification',
        body: 'Body of your push notification'
    }
};


const postData = {
    "m2m:sub": {
        "rn": 'aei-jibcon_test2',
        "enc": {
            "net": [1, 3, 4]
        },
        "nu": ["mqtt://13.124.172.12/aei-jibcon_test2"],
        "nct": 2,
        "pn": 1
    }
};
const options = {
    hostname: '13.124.172.12',
    port: 7579,
    path: '/Mobius/ae-smarts',
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'X-M2M-RI': '12345',
        'X-M2M-Origin': 'aei-jibcon',
        'Content-Type': 'application/json;ty=23'
    }
}


router.post('/addSub', (req, res) => {


    options.path = options.path + '/' + req.body.cntName;

    var httpReq = http.request(options, (httpRes) => {

        console.log(`STATUS: ${httpRes.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(httpRes.headers)}`);
        httpRes.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            res.status(200).end();
        });
        httpRes.on('end', () => {
            console.log('No more data in response.');
        });

    });
    httpReq.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });
    //console.log(httpReq);
// write data to request body
    httpReq.write(JSON.stringify(postData));
    httpReq.end();

});

function connectMqtt() {
    var client = mqtt.connect('mqtt://13.124.172.12/aei-jibcon_test');
    client.on('connect', () => {
        client.subscribe('/oneM2M/req/Mobius/#');
        //client.subscribe('/Mobius/ae-smarts/#')
        console.log('mqtt connect');
    });
    client.on('message', (topic, message) => {
        switch (topic) {
            case '/oneM2M/req/Mobius/aei-jibcon_test2/json' :
                console.log(message.toString());

//callback style
                fcm.send(pushMessage, function (err, response) {
                    if (err) {
                        console.log("Something has gone wrong!");
                    } else {
                        console.log("Successfully sent with response: ", response);
                    }
                });

//promise style
//                 fcm.send(pushMessage)
//                     .then(function (response) {
//                         console.log("Successfully sent with response: ", response);
//                     })
//                     .catch(function (err) {
//                         console.log("Something has gone wrong!");
//                         console.error(err);
//                     });

                break;
        }
        //console.log(message.toString());
    });
}

connectMqtt();

module.exports = router;