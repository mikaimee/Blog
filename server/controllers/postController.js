const Post = require('../models/Post')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

// GET ALL POSTS
// route: GET /posts
// access: Public
const getAllPosts = asyncHandler(async(req, res) => {
    const posts = await Post.find().lean()

    if (!posts?.length) {
        return res.status(400).json({message: 'No posts are found'})
    }

    res.json(posts)
})

// GET POST WITH USER
// route: GET /post/postwithUser
// access: Public
const getPostsWithUser = asyncHandler(async (req,res) => {
    const posts = await Post.find().lean()
    const postsWithUser = await Promise.all(posts.map(async(post) => {
        const user = await User.findById(post.user).lean().exec()
        return {...post, username: user.username}
    }))
})

// GET ONE POST
// route: GET /post/:id
// access: Public
const getOnePost = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({'message': 'Post ID required'})

    const post = await Post.findOne({_id: req.params.id}).exec()
    if (!post) {
        return res.status(204).json({'message': 'No post matches with provided ID'})
    }
    res.json(post)
}



// CREATE POST
// route: POST /posts
// access: Private
const createPost = asyncHandler(async(req, res) => {
    const {user, title, body} = req.body
    if (!user || !title || !body) {
        return res.status(400).json({message: 'All field are required'})
    }

    const post = await Post.create({user, title, body})
    if (post) {
        return res.status(201).json({message: 'Post is created'})
    }
    else {
        res.status(400).json({ message: 'Invalid post data received' })
    }
})

// UPDATE POST
// route: PATCH /posts
// access: Private
const updatePost = asyncHandler(async(req, res) => {
    const {id, user, title, body} = req.body
    if (!id || !user || !title || !body) {
        return res.status(400).json({message: 'All fields are required'})
    }

    const post = await Post.findById(id).exec()
    if (!post) {
        return res.status(400).json({message: 'Post is not found'})
    }

    post.user = user
    post.title = title
    post.body = body

    const updatedPost = await post.save()

    res.json({ message: `${updatedPost.title} updated` })
})

// @desc Delete post
// @route DELETE /posts
// @access Private
const deletePost = asyncHandler(async (req, res) => {
    const {id} = req.body
    if (!id) {
        return res.status(400).json({ message: 'Post ID Required' })
    }

    const post = await Post.findById(id).exec()
    if (!post) {
        return res.status(400).json({ message: 'Post not found' })
    }

    const deletedPost = await post.deleteOne()

    res.json({message:`Post: ${deletedPost.title} with ID ${deletedPost._id} deleted`})
})

module.exports = {
    getAllPosts,
    getPostsWithUser,
    getOnePost,
    createPost,
    updatePost,
    deletePost,
}
