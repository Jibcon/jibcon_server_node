var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Product = require('../models/product');

router.get('/products', function (req, res) {
    Product.find((err, products) => {
        if (err) {
            res.status(404);
        } else {
            res.status(200).json(products);
        }
    });
});

router.post('/products', function (req, res) {

    let company;
    console.log(req.body.company_name);

    Company.findOne({company_name: req.body.company_name}, (err, _company) => {
        if (err) {
            res.status(404);
        }
        company = _company;

          let product = new Product({
                company_id: company.company_id,
                product_id: Product.id,
                product_name: req.body.product_name,
            }
        );

        product.save((err) => {
            if (err) {
                res.status(404);
            }
            else {
                res.status(201).json({
                    success: true
                });
            }
        });
    });


});

router.delete('/companies', (req, res) => {
    Company.remove({company_id: req.body.company_id}, (err, output) => {
        if (err) res.status(500);
        else
            res.status(200).json({
                success: true
            });
    });
});
router.delete('/products', (req, res) => {
    Product.remove({product_id: req.body.product_id}, (err, output) => {
        if (err) res.status(500);
        else
            res.status(200).json({
                success: true
            });
    });
});

module.exports = router;