const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const user = {
    id:"2",
    username: "xuros",
    email:"xurixam@gmail.com",
    password:"12345678"
}

TOKEN_SECRET = "onlytheknowledgesetsfree"

    const token = jwt.sign({ _id: user._id, username: user.username, email:user.email }, TOKEN_SECRET)
    //user.save();
    console.log(token);


// const token = jwt.sign({id:user.id, username:user.username, secretToken})



// const secretToken = "kwnowledge"

// function createToken() {
//     const token = jwt.sign({id:user.id, email:user.email}, secretToken, {expiresIn: 600})
//     console.log(token);
// }

// function testToken(token) {
//     try {
//         const validData = jwt.verify(token, secretToken)
//         console.log(validData);
//     } catch (error) {
//         console.log(error);
//     }
// }

// //createToken()
// testToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6Inh1cmltQGdtYWlsLmNvbSIsImlhdCI6MTY4ODUwNTA3MywiZXhwIjoxNjg4NTA1MTMzfQ.MiblBN1S3Bq04UJIcG67mYKVh3-I_rJbeeAURRc12TM")


// //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImpvYW9AZ21haWwuY29tIiwiaWF0IjoxNjg4NDg0NjA4fQ.kwSr-OyZOK0UR4_dESbmMh89ZAl4Emww2y_02ArvLsI"

// //const validData = jwt.verify(token, secretToken)

// //console.log(validData);