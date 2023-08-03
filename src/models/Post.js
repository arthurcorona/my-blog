const mongoose = require('mongoose')

const Schema = mongoose.Schema

const postSchema = new Schema({
    title: { 
        type: String
    },
    url: {
        type: String
    },
    likes: {
      type: Number,
        default: 0
    },
    date: {
          type: Date
    }
});

module.exports = Post = mongoose.model("Post", postSchema)