const Auth = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// LOGIN
// route: POST /login
// access: Public
const login = asyncHandler(async (res, res) => {
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).json({message: 'All fields are required'})
    }

    const loggingUser = await User.findOne({username}).exec()
    if(!loggingUser) {
        return res.status(401).json({message: 'Unauthorized'})
    }

    const matchPassword = await bcrypt.compare(password, loggingUser.password)
    if (!matchPassword) return res.status(401).json({message: 'Password does not match'})

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": loggingUser.username,
                "roles": loggingUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30m'}
    )

    const refreshToken = jwt.sign(
        {"username": loggingUser.username},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '1d'}
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({accessToken})
})

// REFRESH
// route: GET /refresh
// access Public
const refresh = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(401).json({message: 'Unauthorized'})

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async(err, decoded) => {
            if (err) return res.status(403).json({message: 'Forbidden'})

            const loggingUser = await User.findOne({username: decoded.username}).exec()
            if(!loggingUser) return res.status(401).json({message: 'Unauthorized'})

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": loggingUser.username,
                        "roles": loggingUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m'}
            )

            res.json({accessToken})
        })
    )
}

// LOGOUT
// route: POST /logout
// access: Public
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    res.clearCookie (
        'jwt', 
        {
            httpOnly: true, 
            sameSite: 'None',
            secure: true
        }
    )
    res.json({message: 'Cookie cleared and successfully logged out'})
}

module.exports = {
    login,
    refresh,
    logout
}