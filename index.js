const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/ChronoSneaks")

const express = require("express")
const app = express()

//new changes
const nocache = require('nocache');
app.use(nocache());

//for user routes
const userRoute = require('./routes/userRoute')
app.use('/',userRoute)

//for amdin routes
const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute)

app.listen(3000,()=>{
    console.log("Server started");
})