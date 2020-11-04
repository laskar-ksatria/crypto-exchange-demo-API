const jwt = require('jsonwebtoken');
const secret = 'owlking'

exports.generateToken = (payload) => {
    let token = jwt.sign(payload, secret);
    return token;
};

exports.verifyToken = (token) => {
    return jwt.verify(token, secret);
};