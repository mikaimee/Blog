const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find().select('-password').lean()

    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
})

// @desc Create all users
// @route POST /users
// @access Private
const createUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    // Confirm data
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).collation({locale: 'en', strength: 2}).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    // If don't have array of roles or if array but doesn't have length, use username + password
    // If not, use username, password, roles
    const newUser = (!Array.isArray(roles) || !roles.length)
        ? {username, "password": hashedPwd}
        : {username, "password": hashedPwd, roles}

    // Create and store new user 
    const user = await User.create(newUser)
    if (user) { // is created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, password, profilePic, email, desc } = req.body

    // Confirm data 
    if (!id || !username || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ username }).collation({locale: 'en', strength: 2}).lean().exec()
    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }
    user.username = username
    user.email = email
    user.profilePic = profilePic
    user.desc = desc
    user.roles = roles
    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    res.json({message:`Username ${result.username} with ID ${result._id} deleted`})
})

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
}