const express = require('express')
const path = require('path')
const router = express.Router()
const postModel = require('../models/Post')
const postController = require('../controllers/postController')

router.get('/title', postController.redirect)

router.get('/', postController.searchPost)



//contador de likes do post

router.post('/:id/upvote', postController.upvote);
router.post('/:id/downvote', postController.downvote);

//

function insertPostData() {
    postModel.insertMany([
        {
            title: "Titulo do post Teste",
            description: "texto teste da descrição do post",
        }    
    ])
}
//insertPostData()

router.get('', async(req, res) => {
    const post = {
        title:"Blog nodejs teste titulo",
        description: "essa é a descrição do post que estou fazendo teste"
    }

    try{
        const data = await postModel.find();
        res.render('index', { post, data })
    } catch(error) {
        console.log(error);
        
    }

})

module.exports = router