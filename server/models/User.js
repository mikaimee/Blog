const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: "www."
    },
    desc: {
        type: String
    }, 
    roles: {
        type: [String],
        default: ["Blogger"]
    }
})

module.exports = mongoose.model('User', userSchema)