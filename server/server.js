require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const {logger, logEvents} = require('./middleware/logger')
const errorLogger = require('./middleware/errorLogger')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const mongoose = require('mongoose')
const PORT = 8000

console.log(process.env.NODE_ENV)
require('./config/dbConnection')

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, '/public')))

//ROUTES
app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoute'))
app.use('/users', require('./routes/userRoute'))
app.use('/posts', require('./routes/postRoute'))
app.use('/comments', require('./routes/commentRoute'))


app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public', '404.html'))
    } 
    else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } 
    else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorLogger)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})

