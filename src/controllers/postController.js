const Post = require('../models/Post')

// postController upvote e downvote
const Like = require("../models/Like");

exports.getLikes = async (req, res) => {
  const { postId } = req.params;
  try {
    const like = await Like.findOne({ postId });
    res.json({ likes: like ? like.likes : 0 });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar likes." });
  }
};

exports.addLike = async (req, res) => {
  const { postId } = req.params;
  try {
    const like = await Like.findOneAndUpdate(
      { postId },
      { $inc: { likes: 1 } },
      { upsert: true, new: true }
    );
    res.json({ likes: like.likes });
  } catch (err) {
    res.status(500).json({ error: "Erro ao adicionar like." });
  }
};



const redirect = async (req, res) => {
    let title = req.params.title
    try{
      let doc = await Post.findOne({ title })
      res.redirect(doc.url) 
    }
    catch(error){
      res.send(error)
    }
}

const searchPost = async (req, res) => {
    let titlePost = req.params.title
    try {
        let doc = await Post.findOne({ title })
        res.send(titlePost)
    }   
    catch(erorr){
        res.send(error)
    }
}

module.exports = { redirect, searchPost }

