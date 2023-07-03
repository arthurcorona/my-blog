const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')


const userRoute = require('./routes/userRoute')

const postRoute = require('./routes/postRoute')


router = express.Router()

app.get("/", (req, res) => {
  res.render("index")
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

//running server 

const PORT = 8080  

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});
