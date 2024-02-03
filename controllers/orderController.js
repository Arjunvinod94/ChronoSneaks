const Cart = require('../models/cartModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')
const Address = require('../models/addressModel')

const confirmOrder = async(req,res)=>{
    try {
        const user_id = req.session.user_id
        const userData = await User.findById({_id: user_id})
        res.render('orderConfirmation',{user: userData})
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    confirmOrder
}