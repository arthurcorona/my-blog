const express = require('express')
const router = express.Router()

const auth = require('../controllers/authController')

router.get('/', auth, (req,res) => {
  if(req.user.admin){
    res.send('Somente o Corona pode ver aqui.')
  }
  else {
    res.status(401).send('No admin: Acesso negado.')
  }
})
module.exports = router