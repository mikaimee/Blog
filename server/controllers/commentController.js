const Comment = require('../models/Comment')
const Post = require('../models/Post')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

// GET ALL COMMENTS
// route: GET /comments
// access: Public
const getAllComments = asyncHandler(async(req, res) => {
    const comments = await Comment.find().lean()
    if (!comments?.length) {
        return res.status(400).json({message: 'No comments are found'})
    }
    res.json(comments)

    // const commentsWithPost = await Promise.all(comments.map(async(comment) => {
    //     const post = await Post.findById(comment.post).lean().exec()
    //     return {...comment, post: post.title}
    // }))
    // res.json(commentsWithPost)
})

// CREATE POST
// route: POST /comments
// access: Private
const createComment = asyncHandler(async(req, res) => {
    const {user, post, body} = req.body
    if (!user || !post || !body) {
        return res.status(400).json({message: 'All field are required'})
    }

    const comment = await Comment.create({user, post, body})
    if (comment) {
        return res.status(201).json({message: 'Comment is created'})
    }
    else {
        res.status(400).json({ message: 'Invalid comment data received' })
    }
})

// UPDATE COMMENT
// route: PATCH /comments
// access: Private
const updateComment = asyncHandler(async(req, res) => {
    const {id, user, post, body} = req.body
    if (!id || !user || !post || !body) {
        return res.status(400).json({message: 'All fields are required'})
    }

    const comment = await Comment.findById(id).exec()
    if (!comment) {
        return res.status(400).json({message: 'Comment is not found'})
    }

    comment.user = user
    comment.post = post
    comment.body = body

    const updatedComment = await comment.save()

    res.json({ message: `Your comment with id of ${updatedComment.id} has been updated` })
})

// @desc Delete comment
// @route DELETE /comments
// @access Private
const deleteComment = asyncHandler(async (req, res) => {
    const {id} = req.body
    if (!id) {
        return res.status(400).json({ message: 'Comment ID Required' })
    }

    const comment = await Comment.findById(id).exec()
    if (!comment) {
        return res.status(400).json({ message: 'Comment not found' })
    }

    const deletedComment = await comment.deleteOne()

    res.json({message:`Comment: ${deletedComment.title} with ID ${deletedComment._id} deleted`})
})

module.exports = {
    getAllComments,
    createComment,
    updateComment,
    deleteComment
}
