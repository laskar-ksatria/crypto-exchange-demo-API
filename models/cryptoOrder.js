const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    pair: {
        type: String,
    },
    order_type: {
        type: String
    },
    amount: {
        type: Number
    },
    price: {
        type: Number,
    },
    gain_loss: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CryptoUser'
    },
    status: {
        type: Boolean,
        default: true
    }
    

})


module.exports = mongoose.model('Order', orderSchema);