const mongoose = require('mongoose')

const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  postId: { type: String, required: true, unique: true },
  likes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Like', likeSchema);

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