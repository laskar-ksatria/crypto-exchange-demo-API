const mongoose = require('mongoose');
const { hashingPassword } = require('../helpers/hashPassword');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        validate: {
            validator: function(value) {
                this.model('CryptoUser').findOne({username: value})
                    .then(user => {
                        if (user) {
                            return false;
                        }else {
                            return true;
                        }
                    })
            },
            message: `Username already taken!`
        },
        required: [true, 'Username cannot be empty']
    },
    password: {
        type: String,
        required: [true, 'Username cannot be empty']
    },
    demo_balance: {
        type:Number,
        default: 10000000
    }
})

userSchema.pre('save', function (next) {
    let pass = hashingPassword(this.password);
    this.password = pass;
    next();
})

const user = mongoose.model('CryptoUser', userSchema);

module.exports = user;