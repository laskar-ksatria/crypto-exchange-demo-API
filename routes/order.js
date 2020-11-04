const express = require('express');
const Router = express.Router();
const OrderController = require('../controllers/OrderController')
const { userAuth } = require('../middlewares/auth')

Router.get('/trade', OrderController.readAll);
Router.get('/trade/mytrade', userAuth,OrderController.readMe);
Router.post('/trade', userAuth, OrderController.create);
Router.post('/updatetrade/:tradeId', userAuth, OrderController.updateGainLoss)
module.exports = Router;