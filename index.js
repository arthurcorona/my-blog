const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')

//definindo a rota principal (do ejs)

router = express.Router()

app.get("/", (req, res) => {
  res.render("index")
})

//models and routes

// const User = require('./models/User')

// const UserRoute = require('./routes/userRoute')

// connecting to mongo

main().catch(err => console.log(err));
 
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/testingDB');
}

mongoose.set("strictQuery", true);

// ejs configuration

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'templates'))

//creating properties to document

//running server 

const PORT = 8080  

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});