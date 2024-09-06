require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')

const adminRoute = require('./src/routes/adminRoute')
const userRoute = require('./src/routes/userRoute')
const postRoute = require('./src/routes/postRoute')

const User = require('./src/models/User')

router = express.Router()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.json({ type: 'application/vnd.api+json' }))

app.get("/", (req, res) => {
  res.render("index")
})

app.use('/', express.urlencoded({extended:true}), userRoute)
//app.use('/', express.json(), userRoute) this is to json files
app.use('/admin', express.json(), adminRoute)

// connecting to mongo

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_URL);
}

mongoose.set("strictQuery", true);

// ejs configuration

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'templates'))
app.use('/public', express.static('public'))

//

app.get('/', (req, res) => {
  res.render('')
})


app.get('/about', (req, res) => {
  res.render('about')
})


app.get('/register', (req, res) => {
  res.render('register')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/posts', (req, res) => {
  res.render('/posts')
})

//running server

PORT  = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running on port: ", PORT);
})