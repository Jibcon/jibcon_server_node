var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Product = require('../models/product');

router.get('/companies', function (req, res) {

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

router.post('/companies', function (req, res, next) {

    let company = new Company({
        company_name: req.body.company_name
    });
    company.save((err) => {
        if (err) {
            return next(err);
        }
        res.status(201).json({
            success: true
        });
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