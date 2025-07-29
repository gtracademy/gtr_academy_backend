// backend/server.js

const express = require('express')
const app = express()   
const bodyParser = require('body-parser')
const cors = require('cors')  
const dotenv = require('dotenv/config')
const { json } = require('body-parser')
const db = require('./Config/db')

 

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))
app.use(json())




// Connect to Server
app.listen(process.env.PORT,()=>{
    console.log("Server is running on port " + process.env.PORT)
})




