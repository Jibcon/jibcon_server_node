var express = require('express');
var router = express.Router();
var mqtt = require('mqtt');
var http = require('http');
var querystring = require('querystring');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

//
// var client = mqtt.connect('mqtt://13.124.172.12/aei-jibcon_test');
// var m2m = 'm2m:sub';
// var mobiusPath = "http://13.124.172.12:7579/Mobius/ae-smarts/";
// var reqBody = {
//     "m2m:sub": {
//         "rn": 'aei-jibcon_test',
//         "enc": {
//             "net": "[1, 3, 4]"
//         },
//         "nu": '[mqtt://13.124.172.12/aei-jibcon_test]',
//         "nct": '2',
//         "pn": '1'
//     }
// };
// var reqHeaders = {
//     'Accept': 'application/json',
//     'M-M2M-RI': '12345',
//     'X-M2M-Origin': 'SOrigin',
//     'Content-Type': 'application/json;ty=23'
// };
//
// router.post('/addSub', (req, res) => {
//
//     mobiusPath = mobiusPath + req.body.cntName;
//     console.log(mobiusPath);
//     console.log('??');
//     console.log(reqBody);
//
//
// });
//
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
    client.on('connect', () =>{
        client.subscribe('/oneM2M/req/Mobius/#');
        //client.subscribe('/Mobius/ae-smarts/#')
        console.log('mqtt connect');
    });
    client.on('message', (topic, message) => {
        switch(topic){
            case '/oneM2M/req/Mobius/aei-jibcon_test2/json' :
                console.log(message.toString());
                break;
        }
        //console.log(message.toString());
    });
}

connectMqtt();

module.exports = router;