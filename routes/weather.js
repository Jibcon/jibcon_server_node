let express = require('express');
let router = express.Router();
let timeDB = require('../models/timeDB');
let FCM = require('fcm-push');
let Task = require('../models/task');
let User = require('../models/user');
let serverkey = 'AAAA7Lx5bLQ:APA91bHMHOpGYBbCnK2kVZJtPv5erQKsnMIuaQJ6WLAxZvnrBdNR6l9jv1moTjumJq70jp9a5fL9ow5KKE_-D17eGCkBV_-HW9zLTnlmzVx48QUs49V9LJiOAqzdYHyCMH1r-8yTjdk0';
let fcm = new FCM(serverkey);
let cron = require('cron');
let axios = require('axios');
let instance = axios.create({
    baseURL: 'http://apis.skplanetx.com/gweather'
});
let appKey = '6f4249ae-dadf-3c5c-a4a1-25f1894c1b41';

function weatherController(){
    
}

let cronjob1 = new cron.CronJob('00 * * * * *', () => {
        weatherController()
    }, () => {

    },
    true,
    'Asia/Seoul'
);
cronjob1.start();

module.exports = router;
