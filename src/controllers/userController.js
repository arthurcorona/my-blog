const bcrypt = require('bcrypt')  
const saltRounds = 14;
const jwt = require('jsonwebtoken')
const User = require("../models/User")
const {loginValidate, registerValidate} = require('./validate')

const userController = {
    
    register: async function(req, res) {

        const inputEmail = req.body.email
        const inputPassword = req.body.password

        const {error} = registerValidate(req.body)
        if(error) return res.status(400).send(error.message)

        const userExists = await User.findOne({email:inputEmail})
        if(userExists) return res.status(400).send("Email já em uso.")

        const salt = bcrypt.genSaltSync(saltRounds);
        const passwordHash = bcrypt.hashSync(inputPassword, salt);

        const user = new User({
            username: req.body.username,
            email: inputEmail,
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

        const { error } = loginValidate(req.body)
        if(error) return res.status(400).send(error.message)

        const inputEmail = req.body.email
        const inputPassword = req.body.password
 
        const userExists = await User.findOne({email:inputEmail})
        if(!userExists) return res.status(400).send("Email e/ou senha incorretos.")

        const passwordMatch = bcrypt.compareSync(inputPassword, userExists.password)
        if(!passwordMatch) {
            return "nothing" 
            //res.status(400).send("Email e/ou senha incorretos aaa.a")
        }
        else{
            const token = jwt.sign({_id: userExists._id}, process.env.TOKEN_SECRET)

            res.header('authorization-token', token)
            //res.redirect("/")
        }
    }
}

module.exports =  userController 