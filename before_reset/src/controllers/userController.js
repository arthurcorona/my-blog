const bcrypt = require('bcrypt')  
const saltRounds = 14;
const jwt = require('jsonwebtoken')
const User = require("../models/User")
const {loginValidate, registerValidate} = require('./validate');
const { func } = require('@hapi/joi');

exports.register = async function(req, res) {
    const inputEmail = req.body.email
    const inputPassword = req.body.password

    try {

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
        const newUser = await user.save()
        const token = await user.generateAuthToken()
        res.send("sucesso bebe")
        console.log("sucess");
        //res.redirect('/login')
    } catch (error) {
        res.status(400).send(error)
    }

}

exports.login = async function(req, res) {

}

exports.userProfile = async function(req, res) {

}


// const userController = {
    
//     register: async function(req, res) {

//     },
//     login: async function(req, res) {

//         try {
//             const inputEmail = req.body.email
//             const inputPassword = req.body.password

//             const userExists = await User.findOne({email}) //removi do email: :inputEmail

//             if(!userExists) return res.status(401).send("Email e/ou senha incorretos.")
            
//             const passwordMatch = bcrypt.compare(inputPassword, userExists.password)
//             if(!passwordMatch) return res.status(401).send("Email e/ou senha inválidos.")


//         } catch (error) {
            
//         }


        // const { error } = loginValidate(req.body)
        // if(error) return res.status(400).send(error.message)

        // const inputEmail = req.body.email
        // const inputPassword = req.body.password
 
        // const userExists = await User.findOne({email:inputEmail})
        // if(!userExists) return res.status(400).send("Email e/ou senha incorretos.")

        // const passwordMatch = bcrypt.compareSync(inputPassword, userExists.password)
        // if(!passwordMatch) {
        //     res.status(400).send("Email e/ou senha incorretos aaa.a")
        // }
        // else{
        //     const token = jwt.sign({_id: userExists._id}, process.env.TOKEN_SECRET)

        //     res.header('authorization-token', token)
        //     //res.redirect("/")
        // }
//     }
// }

//module.exports =  { register, login, userProfile } 