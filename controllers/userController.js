const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')


async function emailAlreadyExists() {
    const selectedUser = await User.findOne({
        email:req.body.email
    })

    if(selectedUser) {
        return res.status(400).send("Email já está em uso")
    }
}

const register = async(req, res) => { 

    emailAlreadyExists()

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
    })
    newUser.save().then(() => {
        res.redirect('/')
    })
    .catch(error => {
        res.send(error)
    })
 }

 const login = async(req, res) => {

    const selectedUser = await User.findOne({
        email:req.body.email
    })
    if(!selectedUser) {
        return res.status(400).send("Email e/ou senha estão incorretos")
    }

    const passwordAndUserMatch = bcrypt(req.body.password,  selectedUser.password) 
    if(!passwordAndUserMatch) {
        return res.status(400).send("Email já está em uso")
        const token = jwt.sign({_id:selectedUser._id, email:selectedUser.email}, process.env.TOKEN_SECRET, {expiresIn: 60})
        res.header('authoration-token', token)
        res.redirect('/')
    }
 }
 

module.exports = { register, login }