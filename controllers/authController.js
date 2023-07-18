const jwt = require('jsonwebtoken')


module.exports = function(req, res, next) {
    const token = req.header('authorization-token')
    if(!token) return res.status(401).send('Acesso Negado!')

    
}