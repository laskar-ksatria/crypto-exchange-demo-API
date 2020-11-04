const express = require('express');
const Router = express.Router();
const { getCryptoPrice } = require('../controllers/getPrice');

Router.use(require('./user'));
Router.use(require('./order'));
Router.get('/getprices', (req,res,next) => {
    getCryptoPrice((err, data) => {
        if (data) {
            res.status(200).json(data);
        }else {
            next(err);
        }
    })
});

const Crypto = require('../models/cryptoOrder');

Router.get('/delete', (req,res,next) => {
    Crypto.deleteMany({})
        .then(() => res.status(200).json({message: "Success"}))
})

module.exports = Router;