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

// save user to database
testUser.save()
  .then(() => {
    console.log('Usuário salvo com sucesso!');
    
    // fetch user and test password verification
    return User.findOne({ username: 'jmar777' });
  })
  .then(user => {
    if (user) {
      user.comparePassword('Password123', function(err, isMatch) {
        if (err) throw err;
        console.log('Password123:', isMatch); // -> Password123: true
      });

      user.comparePassword('123Password', function(err, isMatch) {
        if (err) throw err;
        console.log('123Password:', isMatch); // -> 123Password: false
      });
    }
  })
  .catch(err => {
    console.error(err);
  });
  
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
})
