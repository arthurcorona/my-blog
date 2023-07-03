const Post = require('../models/Post')

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
