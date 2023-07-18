const bcrypt = require('bcrypt')  
const saltRounds = 14;
const jwt = require('jsonwebtoken')
const User = require("../models/User")
const {loginValidate, registerValidate} = require('./validate')

const userController = {
    
    register: async function(req, res) {

        const {error} = registerValidate(req.body)
        if(error) return res.status(400).send(error.message)

        const selectedUser = await User.findOne({email:req.body.email})
        if(selectedUser) return res.status(400).send("Email já em uso.")

        const salt = bcrypt.genSaltSync(saltRounds);
        const passwordHash = bcrypt.hashSync(req.body.password, salt);

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: passwordHash
        })
        try {
            const savedUser = await user.save()
            res.redirect('/login')
        } catch (error) {
            res.status(400).send(error)
        }
    },
    login: async function(req, res) {

        const {error} = loginValidate(req.body)
        if(error) return res.status(400).send(error.message)

        const selectedUser = await User.findOne({email:req.body.email})
        if(!selectedUser) return res.status(400).send("Email e/ou senha incorretos.")

        const passwordMatch = bcrypt.compareSync(req.body.password, selectedUser.password)
        if(!passwordMatch) return res.status(400).send("Email e/ou senha incorretos.")
    
        const token = jwt.sign({_id: selectedUser._id}, process.env.TOKEN_SECRET)

        res.header('authorization-token', token)

        res.redirect("/")

    }
}



module.exports =  userController 