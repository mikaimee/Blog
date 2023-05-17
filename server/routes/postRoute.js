const express = require('express')
const router = express.Router()
const postsController = require('../controllers/postController')

router.route('/')
    .get(postsController.getAllPosts)
    .post(postsController.createPost)
    .patch(postsController.updatePost)
    .delete(postsController.deletePost)

module.exports = router