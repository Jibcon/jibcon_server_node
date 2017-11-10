var express = require('express');
var router = express.Router();
let axios = require('axios');
let Weather = require('../models/weatherMessage');
let instance = axios.create({
    baseURL: 'http://apis.skplanetx.com/gweather'
});
var appKey = '6f4249ae-dadf-3c5c-a4a1-25f1894c1b41';

router.post('/getCurrentWeather', (req, res) => {
    instance.get('/current', {
        params: {
            version: 1,
            lat: req.body.lat,
            lon: req.body.lon,
            appKey: appKey
        }
    })
        .then((response) => {

            console.log('success');
            console.log(response);
            res.status(201).send(response.data);
        })
        .catch((error) => {
            console.log('error');
            console.log(error);
            res.status(403).end();
        });
});

router.post('/saveCurrentLocation',(req,res)=>{
    let newWeatherInstance = new Weather({
        lat : req.body.lat,
        lon : req.body.lon
    });

    newWeatherInstance.save((err, result)=>{
        if(err)
            throw err;
        else
            res.status(201).send(result);
    });
});

router.get('/allWeatherData',(req,res)=>{
    Weather.find()
        .populate('writer')
        .exec((err, weathers)=>{
        if(err)
            throw err;
        res.status(201).json(weathers);
        });


});

router.delete('/deleteAllWeatherData',(req,res)=>{
    Weather.remove({},(err)=>{
        if(err)
            throw err;
        else
            res.status(201).send({
                success:true
            });
    });
});
module.exports = router;



