var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Product = require('../models/product');

router.get('/companies', function (req, res, err) {

    Company.find(function (err, companies) {
        if (err) {
            res.status(404);
        }
        else {
            res.status(200).json(
                companies
            );
        }
    });
});

router.post('/companies', function (req, res) {

    Company.findOne({company_name: req.body.company_name}, (err, _company) => {
        if (err) res.status(500).end();
        if (_company) res.status(404).end();//같은 이름의 회사 이미 존재
        else {
            let company = new Company({
                company_name: req.body.company_name
            });
            console.log('??');
            company.save((err) => {
                if (err) {
                    res.status(404);
                }
                res.status(201).json({
                    success: true
                });
            });
        }
    });


});

router.delete('/companies/:id', (req, res) => {
    Company.remove({_id: req.params.id}, (err, output) => {
        if (err) res.status(500);
        else
            res.status(200).json({
                success: true
            });
    });
});

module.exports = router;