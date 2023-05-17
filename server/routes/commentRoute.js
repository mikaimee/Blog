const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentController')

router.route('/')
    .get(commentController.getAllComments)
    .post(commentController.createComment)
    .patch(commentController.updateComment)
    .delete(commentController.deleteComment)

module.exports = router