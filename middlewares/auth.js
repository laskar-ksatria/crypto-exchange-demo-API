const { verifyToken } = require('../helpers/jwtAuth')


exports.userAuth = (req,res,next) => {
    if (req.headers.cryptotoken) {
        let decoded = verifyToken(req.headers.cryptotoken);
        req.decoded = decoded;
        next();
    }else {
        next({message: 'You must login first as user'})
    }
};