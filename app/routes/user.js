const controller = require('../controllers/user');
const router = require('express').Router();

//Routes for register, login, logout
router
    .post('/register', controller.registerUser)
    .post('/login', controller.loginUser)
    .post('/logout', controller.logoutUser)


module.exports = router