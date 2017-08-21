var express = require('express');
var router = express.Router();
var User = require('../models/user');
var DeviceItem = require('../models/DeviceItem');

router.get('/devices', (req, res) => {

    var userToken = req.headers.authorization;

    User.findOne({token: userToken}, (err, user) => {
        console.log(user);
        if (err) res.status(500);
        else {
            res.status(200).json(
                user.deviceItems
            );
        }
    });
});

router.post('/devices', (req, res) => {

    if (req.body === null) res.status(500).end();

    var userToken = req.headers.authorization;
    console.log(userToken);
    User.findOne({token: userToken}, (err, user) => {
        if (err) res.status(500).end();

        if (user === null) res.status(500).end();


        var newItem = new DeviceItem({

            deviceCom: req.body.deviceCom,
            deviceName: req.body.deviceName,
            deviceType: req.body.deviceType,
            deviceOnOffState: req.body.deviceOnOffState,
            subscribeOnOffState: req.body.subscribeOnOffState,
            roomName: req.body.roomName,
            aeName: req.body.aeName,
            cntName: req.body.cntName,
            content: req.body.content,

        });
        user.deviceItems.push(newItem);
        user.save((err) => {
            if (err) {
                throw err;
                res.status(500);
            }

            res.status(200).json({
                success: true
            });
        });

    });


});

module.exports = router;
