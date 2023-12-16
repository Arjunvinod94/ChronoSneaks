const express = require("express")
const user_route = express()
const session = require('express-session')

//for session
const config = require('../config/config')
user_route.use(session({secret:config.sessionSecret}))
const auth = require('../middleware/auth') 

user_route.set('view engine','ejs')
user_route.set('views','./views/users')

const bodyParser = require("body-parser")
user_route.use(bodyParser.json())
user_route.use(bodyParser.urlencoded({extended:true}))

const multer = require("multer")
const path = require("path")

//for public files
user_route.use(express.static('public'))

const userController = require('../controllers/userController')

user_route.get('/register',auth.isLogout,userController.loadRegister)

user_route.post('/register',userController.insertUser)

//for email verification
user_route.get('/verify',userController.verifyMail)

//for user login
user_route.get('/',auth.isLogout,userController.loginLoad)
user_route.get('/login',auth.isLogout,userController.loginLoad)

user_route.post('/login',userController.verifyLogin)

//for user forgot password
user_route.get('/forget',auth.isLogout,userController.forgetLoad)
user_route.post('/forget',userController.forgetVerify)

user_route.get('/forget-password',auth.isLogout,userController.forgetPasswordLoad)
user_route.post('/forget-password',userController.resetPassword)

// user home
user_route.get('/home',auth.isLogin,userController.loadHome)

//logout
user_route.get('/logout',auth.isLogin,userController.userLogout)

//user edit
user_route.get('/edit',auth.isLogin,userController.editLoad)
user_route.post('/edit',userController.updateProfile)

module.exports = user_route