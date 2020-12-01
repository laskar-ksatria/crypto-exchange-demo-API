const User = require('../models/cryptoUser');
const { checkPassword } = require('../helpers/hashPassword')
const { generateToken } = require('../helpers/jwtAuth')

class UserController {

    static readAll(req,res,next) {
        User.find({})
            .then(users => {
                res.status(200).json(users)
            })
            .catch(next)
    };

    static readMe(req,res,next) {
        User.findOne({_id: req.decoded.id})
            .then(user => {
                res.status(200).json(user)
            })
            .catch(next);
    };

    static create(req,res,next) {
        console.log(req.body);
        let { username, password } = req.body;
        User.create({username, password})
            .then(user => {
                res.status(202).json({message: 'Thank you for registering'})
            })
            .catch(next)
    };

    static Login(req,res,next) {
        let { password, username } = req.body;
        User.findOne({username})
            .then(users => {
                if (users) {
                    if (checkPassword(password, users.password)) {
                        let payload = {id: users.id}
                        let token = generateToken(payload);
                        res.status(201).json({message: `Welcome ${users.username}`, token, user: users})
                    }else {
                        next({message: 'Invalid email / password'})
                    }
                }else {
                    next({message: 'Invalid email / password'})
                }
            })
    };

};

module.exports = UserController;