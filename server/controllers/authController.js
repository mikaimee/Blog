const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const SECRET_AT = process.env.ACCESS_TOKEN_SECRET
const SECRET_RT = process.env.REFRESH_TOKEN_SECRET

// LOGIN
// route: POST /auth/login
// access: Public
const login = asyncHandler(async (req, res) => {
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const loggingUser = await User.findOne({username}).exec()

    const match = await bcrypt.compare(password, loggingUser.password)
    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const roles = Object.values(loggingUser.roles).filter(Boolean)
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": loggingUser.username,
                "roles": roles,
            }
        },
        SECRET_AT,
        { expiresIn: '15m' }
    )


    const refreshToken = jwt.sign(
        {"username": loggingUser.username},
        SECRET_RT,
        {expiresIn: '1d'}
    )

    loggingUser.refreshToken = refreshToken
    const result = await loggingUser.save()
    console.log(result)
    console.log(roles)
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    }) 

    res.json({roles, accessToken, message: 'You are logged in!'},)
})

// REFRESH
// route: GET /auth/login
// access Public
const refresh = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })
    const refreshToken = cookies.jwt
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})

    const loggingUser = await User.findOne({refreshToken}).exec()

    if (!loggingUser) {
        jwt.verify(
            refreshToken,
            SECRET_RT,
            async (err, decoded) => {
                if (err) return res.sendStatus(403).json({ message: 'Forbidden'})
                const hackedUser = await User.findOne({username: decoded.username}).exec()
                hackedUser.refreshToken = []
                const result = await hackedUser.save()
            }
        )
        return res.sendStatus(403).json({message: 'Forbidden'})
    }

    const newRefreshTokenArray = loggingUser.refreshToken.filter(rt => rt !== refreshToken)

    jwt.verify (
        refreshToken,
        SECRET_RT,
        asyncHandler(async(err, decoded) => {
            if (err) {
                loggingUser.refreshToken = [...newRefreshTokenArray]
                const result = await loggingUser.save()
            }
            if (err || loggingUser.username !== decoded.username) return res.sendStatus(403).json({message: 'Forbidden'})

            const roles = Object.values(loggingUser.roles)
            const accessToken = jwt.sign (
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles,
                    }
                },
                SECRET_AT,
                {expiresIn: '30m'}
            )

            const newRefreshToken = jwt.sign (
                {"username": loggingUser.username},
                SECRET_RT,
                {expiresIn: '5m'}
            )

            loggingUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]
            const result = await loggingUser.save()

            res.cookie('jwt', newRefreshToken, {httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000})
            res.json({accessToken})
        })
    )

    // jwt.verify(
    //     refreshToken,
    //     SECRET_RT,
    //     asyncHandler(async (err, decoded) => {
    //         if (err) return res.status(403).json({ message: 'Forbidden'})

    //         const loggingUser = await User.findOne({ username: decoded.username }).exec()

    //         if (!loggingUser) return res.status(401).json({ message: 'Unauthorized' })

    //         const accessToken = jwt.sign(
    //             {
    //                 // "username": loggingUser.username,
    //                 // "id": loggingUser._id,
    //                 // "roles": loggingUser.roles
    //                 "UserInfo": {
    //                     "id": loggingUser._id,
    //                     "username": loggingUser.username,
    //                     "roles": loggingUser.roles,
    //                     "profilePic": loggingUser.profilePic,
    //                     "desc": loggingUser.desc,
    //                     "email": loggingUser.email
    //                 }
    //             },
    //             SECRET_AT,
    //             {expiresIn: '30m'}
    //         )
    //         res.json({ accessToken, message: 'Token has been refreshed'})
    //     })
    // )
}


// LOGOUT
// route: POST /auth/login
// access: Public
const logout = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt

    const loggingUser = await User.findOne({refreshToken}).exec()
    if (!loggingUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
        return res.sendStatus(204)
    }

    loggingUser.refreshToken = loggingUser.refreshToken.filter(rt => rt !== refreshToken)
    const result = await loggingUser.save()
    console.log(result)

    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
    res.json({message: 'Cookie cleared and you have logged out successfully'})
    res.sendStatus(204)
    // const cookies = req.cookies
    // if (!cookies?.jwt) return res.sendStatus(204)
    // res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    // res.json({message: 'Cookie cleared and you have logged out successfully'})
}

module.exports = {
    login,
    refresh,
    logout
}