var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Product = require('../models/product');


router.param("cId", function (req, res, next, id) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        var err = new Error("Invalid id.");
        err.status = 400;
        return next(err);
    }

    Company.findById(id, function (err, doc) {
        if (err) {
            return next(err);
        }
        if (!doc) {
            err = new Error("Not found.");
            err.status = 404;
            return next(err);
        }

        req.company = doc;
        return next();
    });
});

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

router.get('/companies/:cId', function (req, res) {
    res.json(req.company);
});

router.post('/companies', function (req, res, next) {
    let company = new Company(req.body);

    company.save((err, company) => {
        if (err) {
            err.status = 400;
            err.message = "You must contain the name.";
            return next(err);
        }
        res.status(201);
        res.json(company);
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