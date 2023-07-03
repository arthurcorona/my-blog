const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')

// user requesting the post name

app.get('/:title', async (req, res) => {
  let title = req.params.title
  try{
    let doc = await Post.findOne({ title })
    res.redirect(doc.url) 
  }
  catch(error){
    res.send(error)
  }
})

const User = require('./models/User')


//let user = new User({
//  username: "Corona",
//  password:"admin",
//  email:"coronarex@proton.me"
//})

//user.save().then(doc => {
//  console.log(doc);
//}).catch(error => {
//  console.log(error);
//})

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
  await mongoose.connect('mongodb://127.0.0.1:27017/my-blog');
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
