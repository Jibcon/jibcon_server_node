var express = require('express');
var router = express.Router();
var waterfall = require('async-waterfall');
var User = require('../models/user');
var https = require('https');
var async = require('async');

var rand_token = require('rand-token');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


function facebookLogin(access_token, res) {
    var path = 'https://graph.facebook.com/me?access_token=' + access_token;
    //console.log('path : ', path);
    https.get(path, (response) => {
        response.on('data', (d) => {
            var json = JSON.parse(d);
            console.log(json);
            User.findOne({user_id: json.id}, (err, user) => {
                var foundUser;
                console.log(user);
                if (err) res.status(400);
                if (user == null) {
                    //signup
                    console.log('signup');
                    var path = `https://graph.facebook.com/${json.id}/?access_token=${access_token}&fields=email,picture,first_name,last_name`;

                    console.log(path);
                    https.get(path, (response) => {
                        response.on('data', (d) => {
                            var json = JSON.parse(d);
                            var generated_token = rand_token.generate(48);
                            console.log('grap api data : ', json);
                            var newUser = new User({
                                email: json.email,
                                first_name: json.first_name,
                                last_name: json.last_name,
                                pic_url: json.picture.data.url,
                                token: generated_token,
                                user_id: json.id,
                                userinfo: {
                                    type: 'facebook',
                                    full_name: json.first_name + json.last_name,
                                    token: generated_token,
                                    pic_url: json.picture.data.url
                                },
                            });

                            console.log(json.picture.data.url);
                            newUser.save((err) => {
                                if (err) res.status(500);

                            });
                            foundUser = newUser;

                            res.status(200).json(foundUser);
                        });
                        //graph api
                    }).on('error', (e) => {
                        console.log(e);
                    });
                }
                else {
                    //login
                    foundUser = user;
                    res.status(200).json(foundUser);
                }

            });


        });

    }).on('error', (e) => {
        console.log(e);
    });
}

function samplelogin(access_token, res) {
    User.findOne({token: access_token}, (err, user) => {
        if (err) {
            throw err;
        }

    });
}

router.post('/social_sign_up_or_in', (req, res) => {
    var access_token = req.body.token;
    var type = req.body.type;
    console.log('token : ', access_token);
    console.log('type : ', type);

    if (type == 'facebook') {

        facebookLogin(access_token, res);
    } else if (type == 'kakao') {
        kakaologin(access_token, res);

    } else if (type == 'naver') {

    }
});
router.post('/samples_sign_up', function (req, res) {

    let newUser = new User({
        email: req.body.email,

        first_name: req.body.first_name,
        last_name: req.body.last_name,
        token: req.body.token,

        userinfo: {
            type: 'sample',
            full_name: req.body.first_name + req.body.last_name,
            token: req.body.token,
            pic_url: req.body.pic_url
        }


    });
    newUser.save((err, output) => {
        if (err) {
            throw err;
            res.status(500).end();
        }
        res.status(200).json({
            output
        })
    })
});

router.get('/samples/sign_in', function (req, res) {
    var max = 1;
    var min = 1;
    var rand = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(rand);

    User.findOne({token: rand}, (err, user) => {
        if (err) {

            res.status(500).end();
            throw err;
        }
        if (user === null)
            res.status(500).end();
        else {
            res.status(200).json(
                user
            );
        }

    });

});

router.delete('/deleteSpecificUser/:email', (req, res) => {

    console.log(req.params.email);
    User.remove({email: req.params.email}, (err, output) => {
        if (err) res.status(500).end();

        res.status(200).json({
            success: true
        })
    });

});


router.get('/allusers', function (req, res) {


    User.find((err, users) => {
        if (err) res.status(500);
        else
            res.json(users);
    });
});

router.put('/updateUser',(req, res) => {

});

router.delete('/deleteUser/:uid', (req, res) => {
    console.log(req.params.uid);
    User.remove({_id: req.params.id}, (err, ouput) => {
        if (err) res.status(500).end();
        else
            res.status(200).json({
                success: true
            })
    });
});

module.exports = router;
