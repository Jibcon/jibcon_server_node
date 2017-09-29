var express = require('express');
var router = express.Router();
var User = require('../models/user');
var DeviceItem = require('../models/DeviceItem');
var waterfall = require('async-waterfall');
router.get('/devices', (req, res) => {

    var userToken = req.headers.authorization.substr(6,1);
    //Token 1
    console.log(userToken);
    DeviceItem.find({user: userToken}, (err, devices) => {

        if (err) res.status(500).end();
        else {
            res.status(200).json(
                devices
            );
        }
    });
});

router.put('/devices/:id', (req, res) => {
    console.log('put devices');
    var userToken = req.headers.authorization.substr(6);
    DeviceItem.findById(req.params.id, (err, device) => {
        //device = req.body;
        device.user = req.body.user;
        device.deviceCom = req.body.deviceCom;
        device.deviceType = req.body.deviceType;
        device.deviceOnOffState = req.body.deviceOnOffState;
        device.subscribeOnOffState = req.body.subscribeOnOffState;
        device.roomName = req.body.roomName;
        device.cntName = req.body.cntName;
        device.content = req.body.contnet;
        device.aeName = req.body.aeName;
        device.save((err) => {
            if (err) res.status(500).end();
            else
                res.status(200).json({
                    success: true
                });
        });


    });
});

router.get('/alldevices', (req, res) => {
    DeviceItem.find((err, devices) => {
        res.status(200).json(devices);
    });
});

router.delete('/deleteDevice/:id', (req, res) => {
    console.log(req.params.id);
    DeviceItem.remove({_id: req.params.id}, (err, output) => {
        res.status(200).json({
            success: true
        });
    });
});


router.post('/devices', (req, res) => {

    if (req.body === null) res.status(500).end();

    var userToken = req.headers.authorization.substr(6,1);
    console.log(userToken);
    var newDevice = new DeviceItem({
        user: userToken,
        //user를 Token으로 검색하고 _id로 검색후 저장
        deviceCom: req.body.deviceCom,
        deviceName: req.body.deviceName,
        deviceType: req.body.deviceType,
        deviceOnOffState: req.body.deviceOnOffState,
        subscribeOnOffState: req.body.subscribeOnOffState,
        roomName: req.body.roomName,
        aeName: req.body.aeName,
        cntName: req.body.cntName,
        contnet: req.body.content
    });

    newDevice.save((err) => {
        if (err) throw err;
        res.status(200).json({
            success: true
        })
    });


});


router.get('/waterfalltest', (req, res) => {
    // waterfall([
    //     function(callback){
    //         callback(null, 'hello');
    //     },
    //     function(arg1, callback){
    //          console.log('arg1 : ',arg1);
    //          callback(null, arg1, 'world');
    //     },
    //     function(arg1, arg2, callback){
    //         console.log('arg1 : ', arg1, 'arg2 : ',arg2);
    //          callback(null, arg1, arg2, 'node');
    //     },
    //     function(err, result){
    //
    //         console.log('result : ',result);
    //
    //     }
    // ]);
    waterfall([
        function (callback) {
            console.log('1');
            callback(null, '1');
        },
        function (arg1, callback) {

            console.log('2');

            callback(null, '1');
        },
        function (arg1, callback) {

            console.log('3');
            callback(null, 'done');
        },

    ]);

});

//
// Animal.remove({}, function () {
//     console.log("1. Animal remove success");
//     Animal.create(animalData, function (err) {
//         if (err) console.error("Save Failed.", err);
//         else console.log("2. Animal create success");
//         newAnimal.save(function (err, instance) {
//             if (err) console.error("Save Failed.", err);
//             else console.log("3. elephant new success");
//
//             db.close(function () {
//                 console.log("4. db connection closed");
//             });
//         });
//     });
// });

//
//
// Animal.remove({}, () => {
//     waterfall([
//         function (callback) {
//             console.log('1. Animal remove success');
//             Animal.create(animalData, (err) => {
//                 if (err) console.log('Save Failed', err);
//                 else console.log('2. Animal create success');
//
//             });
//             callback(null, 'newAnimal');
//         },
//         function (newAnimal, callback) {
//             newAnimal.save((err, instance) => {
//                 if (err) console.err('save failed');
//                 else console.log('3. elephant new success');
//             });
//             db.close(() => {
//                 console.log('4. db connection closed');
//             })
//         }
//     ]);
//
// });


module.exports = router;
