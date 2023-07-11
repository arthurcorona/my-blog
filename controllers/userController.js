const User = require("../models/User")

const userController = {
    register: async function(req, res) {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        try {
            const savedUser = await user.save()
            res.send(savedUser).redirect('/')
        } catch (error) {
            res.status(400).send(error)
        }
    },
    login: function(req, res) {
        console.log("login");
        res.send('login')
    }
}



module.exports =  userController 