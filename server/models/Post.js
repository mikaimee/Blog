const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    pictures: [{
        type: String
    }],
    likes: {
        type: Number
    }
}, {timestamps: true})

module.exports = mongoose.model('Post', postSchema)