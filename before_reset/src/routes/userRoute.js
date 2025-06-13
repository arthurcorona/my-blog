const express = require('express')
const path = require('path')
const router = express.Router()
const bodyParser = require("body-parser");
const userController = require('../controllers/userController')

router.post('/register', userController.register)

router.post('/login', userController.login)


router.get('/user', userController.userProfile)

module.exports = router 