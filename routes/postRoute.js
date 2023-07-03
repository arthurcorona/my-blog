const express = require('express')
const path = require('path')
const router = express.Router()
const postController = require('../controllers/postController')

router.get('/:title', postController.redirect)

router.get('/', postController.searchPost)


module.exports = router