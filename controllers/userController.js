const User = require('../models/User')

exports.getSignUp = (req, res, next) => {
    res.render('signup', {path:'/signup', pageTitle: 'Sign Up', name:'TTestTe' })
}

exports.postSignUp = (req, res, next) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.res.password,
        date: req.res.date
    })
    newUser.save().then(() => {
        res.redirect('/')
    })
    .catch(error => {
        res.send(error)
    })
}

// to check if the username and the email exists

//if(username && email) {
//    User.findOne()
//}