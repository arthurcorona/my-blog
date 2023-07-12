const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken')
const User = require("../models/User")


const userController = {
    
    register: async function(req, res) {
        
        const selectedUser = await User.findOne({email:req.body.email})
        if(selectedUser) return res.status(400).send("Email já em uso.")

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password)
        })
        try {
            const savedUser = await user.save()
            res.send(savedUser).redirect('/login')
        } catch (error) {
            res.status(400).send(error)
        }
    },
    login: async function(req, res) {
        const selectedUser = await User.findOne({email:req.body.email})
        if(!selectedUser) return res.status(400).send("Email ou senha incorretos.")

        const passwordMatch = bcrypt.compareSync(req.body.password, selectedUser.password)
        if(!passwordMatch) return res.status(400).send("Email ou senha incorretos.")
    
        const token = jwt.sign({_id: selectedUser._id}, process.env.TOKEN_SECRET)

        res.header('authorization-token', token)

        res.redirect("/")

    }
}



module.exports =  userController 