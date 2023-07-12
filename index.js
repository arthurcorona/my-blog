require('dotenv').config
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')


const userRoute = require('./routes/userRoute')
const User = require('./models/User')

const postRoute = require('./routes/postRoute')

router = express.Router()

app.get("/", (req, res) => {
  res.render("index")
})

// create a user a new user
let testUser = new User({
  username: "jmar777",
  password: "Password"
});

//
app.use('/user', express.json(), userRoute)
app.get('/admin', (req,res) => {
  res.send('Somente o Corona pode ver aqui')
})

// connecting to mongo

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/my-blog');
}

mongoose.set("strictQuery", true);

// ejs configuration

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'templates'))
app.use('/public', express.static('public'))

//

app.get("/", (req, res) => {
  res.render("")
})

app.get("/signup", (req, res) => {
  res.render("signup")
})

app.get("/login", (req, res) => {
  res.render("login")
})

//running server  

PORT  = 8080

app.listen(PORT, () => {
  console.log("Server running on port: ", PORT);
})

//app.listen(process.env.PORT, () => {
  //console.log("Server running on PORT: ", process.env.PORT);
//})