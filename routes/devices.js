var express = require('express');
var router = express.Router();
var User = require('../models/user');
var DeviceItem = require('../models/DeviceItem');

router.get('/devices', (req, res) => {

    var userToken = req.headers.authorization.substr(6);
    console.log(userToken);
    DeviceItem.find({user: userToken}, (err, devices) => {
        console.log(devices);
        if (err) res.status(500);
        else {
            res.status(200).json(
                devices
            );
        }
    });
});

router.get('/alldevices',(req, res) => {
    DeviceItem.find((err, devices) => {
        res.status(200).json(devices);
    });
});

router.delete('/deleteDevice/:id', (req, res) => {
    console.log(req.params.id);
    DeviceItem.remove({_id : req.params.id}, (err, output) => {
        res.status(200).json({
            success: true
        });
    });
});


router.post('/devices', (req, res) => {

    if (req.body === null) res.status(500).end();

    var userToken = req.headers.authorization.substr(6);
    console.log(userToken);
    var newDevice = new DeviceItem({
        user : userToken,
        deviceCom : req.body.deviceCom,
        deviceName : req.body.deviceName,
        deviceType : req.body.deviceType,
        deviceOnOffState : req.body.deviceOnOffState,
        subscribeOnOffState : req.body.subscribeOnOffState,
        roomName : req.body.roomName,
        aeName : req.body.aeName,
        cntName : req.body.cntName,
        contnet : req.body.content
    });

    newDevice.save((err) => {
        if(err) throw err;
        res.status(200).json({
            success : true
        })
    });

    // console.log(userToken);
    // User.findOne({token: userToken}, (err, user) => {
    //     if (err) res.status(500).end();
    //
    //     if (user === null) res.status(500).end();
    //
    //
    //     var newItem = new DeviceItem({
    //
    //         deviceCom: req.body.deviceCom,
    //         deviceName: req.body.deviceName,
    //         deviceType: req.body.deviceType,
    //         deviceOnOffState: req.body.deviceOnOffState,
    //         subscribeOnOffState: req.body.subscribeOnOffState,
    //         roomName: req.body.roomName,
    //         aeName: req.body.aeName,
    //         cntName: req.body.cntName,
    //         content: req.body.content,
    //
    //     });
    //     user.deviceItems.push(newItem);
    //     user.save((err) => {
    //         if (err) {
    //             throw err;
    //             res.status(500);
    //         }
    //
    //         res.status(200).json({
    //             success: true
    //         });
    //     });
    //
    // });


});

module.exports = router;
