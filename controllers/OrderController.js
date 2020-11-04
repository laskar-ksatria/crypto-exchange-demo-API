const Order = require('../models/cryptoOrder');
const User = require('../models/cryptoUser');
class OrderController {

    static readAll(req,res,next) {
        Order.find({})
            .then(orders => {
                res.status(200).json(orders)
            })
            .catch(next);
    };

    static readMe(req,res,next) {
        let user = req.decoded.id;
        Order.find({user, status: true})
            .then(orders => {
                res.status(200).json(orders)
            })
            .catch(next);
    };

    static create(req,res,next) {
        let user = req.decoded.id;
        let { pair, amount, price, order_type } = req.body;
        let Io = req.Io;
        Order.create({pair, amount, price, user, order_type})
            .then(userOrder => {
                let minusBalance = Number(amount) * Number(price);
                User.findOneAndUpdate({_id: user}, {$inc: {demo_balance: -minusBalance}}, {omitUndefined: true, new: true})
                    .then(myAccount => {
                        let { demo_balance, _id } = myAccount;
                        Io.emit(`${_id}-balance`, demo_balance);
                        Order.find({user, status: true})
                        .then(orders => {
                            Io.emit(`${_id}-updateorder`, orders);
                            res.status(202).json({message: 'Order has executed'});
                        })
                    })
            })
            .catch(next)
    };

    static updateGainLoss(req,res,next) {
        let Io = req.Io;
        let id = req.params.tradeId;
        let userId = req.decoded.id;
        let { gainLoss } = req.body;
        let fixBalance;
        Order.findOneAndUpdate({_id: id}, {gainLoss: gainLoss, status: false}, {omitUndefined: true, new: true})
            .then(order => {
                User.findOneAndUpdate({_id: userId}, {$inc: {demo_balance: gainLoss}}, {omitUndefined: true, new: true})
                    .then(newUser => {
                        res.status(201).json({message: 'Your order has been close', balance: fixBalance})
                        let { _id, demo_balance } = newUser;
                        Io.emit(`${_id}-balance`, demo_balance);
                        Order.find({user: userId, status: true})
                            .then(orders => {
                                Io.emit(`${_id}-updateorder`, orders);
                            })
                    })
            })
    };

};

module.exports = OrderController;