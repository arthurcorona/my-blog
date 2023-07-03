const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: { 
        type: String
      },
        email: {
          type: String
        },
    password: {
      type: String
    },
    date: {
          type: Date
        }
  });

module.exports = User = mongoose.model("User", UserSchema)