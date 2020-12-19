const { verifyToken } = require('../helpers/jwtAuth')

exports.userAuth = (req,res,next) => {
    if (req.headers.cryptotoken) {
        let token = req.headers.cryptotoken.split(" ")[1];
        let decoded = verifyToken(token);
        req.decoded = decoded;
        next();
    }else {
        next({message: 'You must login first as user'})
    }
};