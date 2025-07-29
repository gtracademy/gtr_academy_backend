// backend/server.js

const express = require('express')
const app = express()   
const bodyParser = require('body-parser')
const cors = require('cors')  
const dotenv = require('dotenv/config')
const engine = require('ejs-mate')
const { json } = require('body-parser')
const db = require('./Config/db')
const homeRoutes = require('./Routes/homeRoutes')
const courseAddRoutes = require('./Routes/adminRoutes')



// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
app.set('views', __dirname + '/Views');
app.set('view engine', 'ejs');


// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))
app.use(json())


// Routes

app.use('/', homeRoutes)
app.use('/course',courseAddRoutes)



// Connect to Server
app.listen(process.env.PORT || 8080,()=>{
    console.log("Server is running on port " + process.env.PORT)
})




