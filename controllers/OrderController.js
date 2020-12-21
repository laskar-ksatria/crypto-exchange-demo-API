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
        Order.find({user: user, status: true})
            .then(orders => {
                res.status(200).json(orders)
            })
            .catch(next);
    };

    static readHistory(req,res,next) {
        let user = req.decoded.id;
        Order.find({u})
    }

    static create(req,res,next) {
        let user = req.decoded.id;
        let { pair, amount, price, order_type } = req.body;
        console.log(req.body)
        let total = Number(amount) * Number(price)
        let Io = req.Io;
        let newTotal
        let summary = 0;
        Order.find({user, status: true})
            .then(orders => {
                console.log(orders);
                if (orders.length > 0) {
                    orders.forEach(item => {
                        let subTotal = item.price * item.amount;
                        summary += subTotal
                    })
                }
                newTotal = summary + total;
                User.findOne({_id: req.decoded.id})
                    .then(userAccount => {
                        let { demo_balance } = userAccount
                        if (demo_balance < newTotal) {
                            next({message: "Sorry, insufficient funds"})
                        }else {
                            Order.create({pair, amount, price, user, order_type})
                                .then(userOrder => {
                                    Order.find({user: req.decoded.id, status: true})
                                        .then(orders => {
                                            res.status(202).json({message: 'Order has been executed', balance: demo_balance, orders: orders});
                                        })
                                })
                        }
                    })
            })
            .catch(next)
        
        // Order.create({pair, amount, price, user, order_type})
        //     .then(userOrder => {
        //         let minusBalance = Number(amount) * Number(price);
        //         User.findOneAndUpdate({_id: user}, {$inc: {demo_balance: -minusBalance}}, {omitUndefined: true, new: true})
        //             .then(myAccount => {
        //                 let { demo_balance, _id } = myAccount;
        //                 Io.emit(`${_id}-balance`, demo_balance);
        //                 Order.find({user, status: true})
        //                 .then(orders => {
        //                     Io.emit(`${_id}-updateorder`, orders);
        //                     res.status(202).json({message: 'Order has been executed', balance: demo_balance, orders: orders});
        //                 })
        //             })
        //     })
        //     .catch(next)
    };

    static updateGainLoss(req,res,next) {
        let Io = req.Io;
        let id = req.params.tradeId;
        let userId = req.decoded.id;
        let { gainLoss } = req.body;
        Order.findOneAndUpdate({_id: id}, {gainLoss: gainLoss, status: false}, {omitUndefined: true, new: true})
            .then(order => {
                let fixBalance = (order.amount * order.price) + gainLoss
                User.findOneAndUpdate({_id: userId}, {$inc: {demo_balance: gainLoss}}, {omitUndefined: true, new: true})
                    .then(newUser => {
                        res.status(201).json({message: 'Your order has been close', balance: newUser.demo_balance})
                        let { _id, demo_balance } = newUser;
                        // Io.emit(`${_id}-balance`, demo_balance);
                        Order.find({user: userId, status: true})
                            .then(orders => {
                                Io.emit(`${_id}-updateorder`, orders);
                            })
                    })
            })
    };

    static sendBalance(req,res,next) {
        let { username, balance } = req.body;
        let Io = req.Io;
        let user = req.decoded.id;
        let userBalance;
        let userId;
        User.findOne({username})
            .then(account => {
                if (account) {
                    User.findOneAndUpdate({_id: account.id}, {$inc: {demo_balance: balance}}, {omitUndefined: true, new: true})
                        .then(newAccount => {
                            userBalance = newAccount.demo_balance
                            userId = newAccount.id;
                            User.findOneAndUpdate({_id: req.decoded.id}, {$inc: {demo_balance: -balance}}, {omitUndefined: true, new: true})
                            .then(newAccount2 => {
                                    Io.emit(`${userId}-balance`, {balance: userBalance, status: 'receive', message: "You have receive balance from " + newAccount2.username})
                                    Io.emit(`${newAccount2.id}-balance`, {balance: newAccount2.demo_balance, status: 'send', message: "Balance transfer success"})
                                    res.status(202).json({message: "Balance has been transfer to" + newAccount2.username})
                                })
                        })
                }else {
                    next({message: "Username not found"})
                }
            })
    };

};

module.exports = OrderController;