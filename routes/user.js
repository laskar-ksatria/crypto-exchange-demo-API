const express = require('express');
const Router = express.Router();
const UserController = require('../controllers/userController')
const { userAuth } = require('../middlewares/auth');

Router.get('/users', UserController.readAll);
Router.get('/users/me', userAuth, UserController.readMe);
Router.post('/users', UserController.create);
Router.post('/users/login', UserController.Login);

module.exports = Router;