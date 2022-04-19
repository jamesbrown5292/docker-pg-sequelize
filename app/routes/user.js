const controller = require('../controllers/user');
const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware')

//Routes for register, login, logout
router
    .post('/register', controller.registerUser)
    .post('/login', controller.loginUser)
    .post('/logout', protect, controller.logoutUser)


module.exports = router