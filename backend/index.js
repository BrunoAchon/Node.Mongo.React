const express = require('express')
const cors = require('cors')

const app = express()

// conf Json respons
app.use(express.json())

// cors
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

// public folder images
app.use(express.static('public'))

//routes


app.listen(5000)