const express = require("express")
const user_route = express()
const session = require('express-session')

//for session
const config = require('../config/config')
user_route.use(session({
    secret: config.userSessionSecret,
    resave: false, // Set to false to avoid deprecation warning
    saveUninitialized: false, // Set to false to avoid deprecation warning
  }));
const auth = require('../middleware/auth') 

user_route.set('view engine','ejs')
user_route.set('views','./views/users')

const bodyParser = require("body-parser") //change it with express
user_route.use(bodyParser.json())
user_route.use(bodyParser.urlencoded({extended:true}))

const multer = require("multer")
const path = require("path")

//for public files
user_route.use(express.static('public'))

const userController = require('../controllers/userController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')

user_route.get('/register',auth.isLogout,userController.loadRegister)

user_route.post('/register',userController.insertUser)

//for email verification
// user_route.get('/verify',userController.verifyMail)

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

//change password
user_route.get('/edit/update-password',auth.isLogin, userController.loadUpdatePassword)
user_route.post('/edit/update-password',userController.verifyUpdatePassword)

//otp page
user_route.get('/verifyotp',auth.isLogout,userController.loadVerify)
user_route.post('/verifyotp',userController.verifyOTP)

user_route.get('/verifyotp/resendOTP',userController.loadResendOTP)

//products
user_route.get('/home/products/watches',auth.isLogin,userController.loadWatchCategory)
user_route.get('/home/products/sneakers',auth.isLogin,userController.loadSneakerCategory)

//detailed view of product
user_route.get('/home/products/watches/watch',auth.isLogin,userController.loadWatchView)
user_route.get('/home/products/sneakers/sneaker',auth.isLogin,userController.loadSneakerView)

//user cart
user_route.get('/shoppingCart',auth.isLogin,cartController.loadshoppingCart)
user_route.post('/home/products/add-to-cart/:productId',auth.isLogin,cartController.userAddToCart)
user_route.delete('/shoppingCart/:product_id',auth.isLogin,cartController.deleteCartItem);

//cart chekout
user_route.get('/shoppingCart/checkout',auth.isLogin,cartController.loadCheckout)
//cart add address
user_route.post('/shoppingCart/add-address',auth.isLogin,cartController.addAddress)
//order confirmation
user_route.post('/shoppingCart/checkout/confirmOrder',orderController.confirmOrder)

module.exports = user_route