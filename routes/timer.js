var express = require('express');
var router = express.Router();
var FCM = require('fcm-push');
var timeDB = require('../models/timer');
var User = require('../models/user');
var weatherMessage = require('../models/weatherMessage');
var timerMessage = require('../models/timerMessage');
var serverkey = 'AAAAv5_ZG2Q:APA91bG_HSu8DupC2tq7sSnVSZc_TCEFzojRrcKSpW90e-7_cVv1z6sqGIsJPIwQZQnDUEjy4dexMApiv4WZukJchK4BLYuun3_XT-KGZiF5Qudgqnf6er8-WgmWVYei4jSs314pJuno';
var fcm = new FCM(serverkey);
let cron = require('cron');
let axios = require('axios');
let Weather = require('../models/weatherMessage');
let instance = axios.create({
    baseURL: 'http://apis.skplanetx.com/gweather'
});
var appKey = '6f4249ae-dadf-3c5c-a4a1-25f1894c1b41';
///////////////////
var pushMessage = {
    to: '', // required fill with device token or topics
    data: {
        your_custom_data_key: ''
    },
    notification: {
        title: 'Jibcon',
        body: ''
    }
};

function fcmMessageSending(pushMessage) {

    fcm.send(pushMessage, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}

router.post('/setTimer/setMessage', (req, res) => {

    let foundUser;
    let timeStamp = req.body.hour + '_' + req.body.minute;
    console.log(timeStamp);


        User.findOne({_id: req.body.userId}, (err, user) => {
            if (err)
                throw err;
            if (user == null)
            {

                res.status(403).end();

            }
            foundUser = user;
            console.log(foundUser);
        });


        timeDB.findOne({time: timeStamp}, (err, time) => {
            if (err)
                throw err;

            if (time == null) {
                const newTimeRecord = new timeDB({
                    time: timeStamp,
                    users: foundUser._id,
                    writer: foundUser._id
                });
                const newTimeMessage = new timerMessage({
                    time: timeStamp,
                    userId: foundUser._id,
                    message: req.body.message,
                    writer: foundUser._id

                });
                newTimeMessage.save((err, message) => {
                    if (err)
                        throw err;
                    console.log(message);
                });
                newTimeRecord.save((err, newTime) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    res.status(201).json(newTime);
                });
            }
            else {
                const newTimeMessage = new timerMessage({
                    time: timeStamp,
                    userId: foundUser._id,
                    message: req.body.message,
                    writer: foundUser._id

                });
                newTimeMessage.save((err, message) => {
                    if (err)
                        throw err;
                    console.log(message);
                });

                time.users.push(foundUser._id);
                time.save((err, result) => {
                    if (err)
                        throw err;
                    res.status(201).json(result);
                });

            }


        });


});

router.post('/setTimer/setWeather', (req, res) => {
    let foundUser;
    let timeStamp = req.body.hour + '_' + req.body.minute;
    console.log(timeStamp);

    User.findOne({_id: req.body.userId}, (err, user) => {
        if (err)
            throw err;
        if (user == null)
            res.status(403).end();
        foundUser = user;
        console.log(foundUser);
    });

    timeDB.findOne({time: timeStamp}, (err, time) => {
        if (err)
            throw err;

        if (time == null) {
            const newTimeDB = new timeDB({
                time: timeStamp,
                users: foundUser._id,
                writer: foundUser._id
            });

            const newWeatherMessage = new weatherMessage({
                time: timeStamp,
                lat: req.body.lat,
                lon: req.body.lon,
                writer: foundUser._id,
                userId: req.body.userId

            });
            newWeatherMessage.save((err, message) => {
                if (err)
                    throw err;
                console.log(message);
            });
            newTimeDB.save((err, newTime) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                res.status(201).json(newTime);
            });
        }
        else {
            const newWeatherMessage = new weatherMessage({
                time: timeStamp,
                lat: req.body.lat,
                lon: req.body.lon,
                writer: foundUser._id,
                userId: req.body.userId


            });
            newWeatherMessage.save((err, message) => {
                if (err)
                    throw err;
                console.log(message);
            });

            time.users.push(foundUser._id);
            time.save((err, result) => {
                if (err)
                    throw err;
                res.status(201).json(result);
            });

        }
    });
});

router.delete('/deleteMessage', (req, res) => {
    //message 지우고 나서 weather에도 없으면 timeDB에서 해당 유저 삭제
    let timeStamp = req.body.hour + '_' + req.body.minute;
    let promise1 = new Promise((resolve, reject) => {
        timerMessage.findOne({_id: req.body._id}, (err, timerMessage) => {
            if (err) {
                reject('timerMessage remove err');
                throw err;
            }
            if (timerMessage != null) {
                timerMessage.remove((err) => {
                    if (err)
                        throw err;
                    else
                        resolve('timerMessage delete success');
                });
            }
            else
                res.status(403).end();


        });

    });

    let promise2 = new Promise((resolve, reject) => {
        weatherMessage.find({userId: req.body.userId, time: timeStamp}, (err, weatherMessage) => {
            if (err) {
                reject('weatherMessage remove err');
                throw err;
            }
            if (weatherMessage.length == 0)
                resolve('weatherMessage empty');
            else {
                console.log(weatherMessage);
                reject('weatherMessage not empty');

            }


        });

    });

    Promise.all([promise1, promise2])
        .then((values) => {

            console.log('remove user from timeDB');
            timeDB.findOne({time: timeStamp}, (err, timedb) => {
                if (err)
                    throw err;
                if (timedb == null) {
                    res.send('timedb NULL');

                }

                let index = timedb.users.indexOf(req.body.userId);
                timedb.users.splice(index, 1);
                timedb.save((err) => {
                    if (err)
                        throw err;
                    res.send({
                        success: true
                    });
                });


            });
        }, (err) => {
            console.log(err);
            res.status(403).end();
        });
});

router.delete('/deleteWeatherMessage', (req, res) => {
    //message 지우고 나서 weather에도 없으면 timeDB에서 해당 유저 삭제
    let timeStamp = req.body.hour + '_' + req.body.minute;
    let promise1 = new Promise((resolve, reject) => {
        weatherMessage.findOne({_id: req.body._id}, (err, weatherMessage) => {
            if (err) {
                reject('weatherMessage remove err');
                throw err;
            }
            if (weatherMessage != null) {
                weatherMessage.remove((err) => {
                    if (err)
                        throw err;
                    else
                        resolve('weatherMessage delete success');
                });
            }
            else
                res.status(403).end();


        });

    });

    let promise2 = new Promise((resolve, reject) => {
        timerMessage.find({userId: req.body.userId, time: timeStamp}, (err, timerMessage) => {
            if (err) {
                reject('timerMessage remove err');
                throw err;
            }
            if (timerMessage.length == 0)
                resolve('timerMessage empty');
            else {
                console.log(timerMessage);
                reject('timerMessage not empty');

            }


        });

    });

    Promise.all([promise1, promise2])
        .then((values) => {

            console.log('remove user from timeDB');
            timeDB.findOne({time: timeStamp}, (err, timedb) => {
                if (err)
                    throw err;
                if (timedb == null) {
                    res.send('timedb NULL');

                }

                let index = timedb.users.indexOf(req.body.userId);
                timedb.users.splice(index, 1);
                timedb.save((err) => {
                    if (err)
                        throw err;
                    res.send({
                        success: true
                    });
                });


            });
        }, (err) => {
            console.log(err);
            res.status(403).end();
        });
});


function timeController() {
    //해당 시간의 시간큐에 들어간 요청 작업들 수행
    var currentTime = new Date();
    var hour = currentTime.getHours() + 9;
    var minute = parseInt(currentTime.getMinutes());
    var timeStamp = hour + '_' + minute;

    console.log(timeStamp);

    timeDB.findOne({time: hour + '_' + minute}, (err, timedb) => {
        if (err)
            throw err;
        if (timedb == null) {
            console.log('no users to send notification');
        } else {
            console.log('found!! send notification');

            let users = timedb.users;
            let length = users.length;
            for (let i = 0; i < length; i++) {
                User.findOne({_id: users[i]}, (err, user) => {
                    if (err)
                        throw err;
                    if (user == null)
                        return;

                    var message = JSON.parse(JSON.stringify(pushMessage));

                    timerMessage.findOne({userId: user._id, time: hour + '_' + minute}, (err, foundMessage) => {
                        if (err)
                            throw err;
                        if (foundMessage != null) {

                            console.log(foundMessage);
                            message.notification.body = foundMessage.message;
                            console.log(message.notification.body);
                            message.to = user.fcm_token;
                            console.log(user.fcm_token);
                            console.log(message);
                            fcmMessageSending(message);

                        }
                    });//message 요청 작업 처리

                    message = JSON.parse(JSON.stringify(pushMessage));
                    weatherMessage.findOne({writer: user._id, time: hour + '_' + minute}, (err, foundMessage) => {
                        if (err)
                            throw err;
                        if (foundMessage != null) {
                            console.log(foundMessage);
                            message.to = user.fcm_token;
                            console.log(foundMessage);
                            instance.get('/current', {
                                params: {
                                    version: 1,
                                    lat: foundMessage.lat,
                                    lon: foundMessage.lon,
                                    appKey: appKey
                                }
                            })
                                .then((response) => {

                                    console.log('success');
                                    let current = response.data.gweather.current;
                                    console.log(current[0].temperature);
                                    //console.log(response.data.gweather.current);
                                    message.notification.body = current[0].temperature.tc;
                                    fcmMessageSending(message);

                                })
                                .catch((error) => {
                                    console.log('error');
                                    console.log(error);
                                });
                        }

                    });//weather 요청 작업 처리

                });
            }

        }

    });

}

router.delete('/deleteAllTimedb', (req, res) => {
    timeDB.remove({}, (err) => {
        if (err)
            throw err;
        res.status(201).end();
    });
});

router.get('/allTimeMessage', (req, res) => {
    timerMessage.find()
        .populate('writer')
        .exec((err, messages) => {
            if (err)
                throw err;
            res.status(201).json(messages);
        });
});
router.delete('/deleteAllTimeMessage', (req, res) => {
    timerMessage.remove({}, (err) => {
        if (err)
            throw err;
        res.send({
            success: true
        })
    });
});
router.get('/allTimedb', (req, res) => {
    timeDB.find()
        .populate('writer')
        .exec((err, timeDB) => {
            if (err)
                throw err;
            res.status(201).json(timeDB);
        })
});


var cronjob1 = new cron.CronJob('00 * * * * *', () => {
        timeController()
    }, () => {

    },
    true,
    'Asia/Seoul'
);
cronjob1.start();

module.exports = router;
