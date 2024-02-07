const Cart = require('../models/cartModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')
const Address = require('../models/addressModel')
const Order = require('../models/orderModel')


// const confirmOrder = async(req,res)=>{
//     try {
//         const user_id = req.session.user_id
//         const userData = await User.findById({_id: user_id})
//         const cartData = await Cart.findOne({_id: user_id}) 
        
//         const address = req.body.address
//         const payment = req.body.payment

//         if(payment === 'cashOnDelivery') {

//             const items = cartData.items.map(cartItem => ({
//                 product: cartItem.product,
//                 quantity: cartItem.quantity,
//                 price: cartItem.price,
//             }));

//             const order = new Order({
//                 customer: user_id,
//                 status: 'pending',
//                 paymentMethod: payment,
//                 orderAddress: address,
//                 totalAmount: cartData.total_price,
//                 items: items,

//         })
//         const orderData = order.save()

//         res.render('orderConfirmation',{user: userData})

//         } else {
//             res.redirect('/shoppingCart/checkout')
//         }

        
        
//     } catch (error) {
//         console.log(error.message);
//     }
// }


const confirmOrder = async (req, res) => {
    try {
        const user_id = req.session.user_id;
        const userData = await User.findById({ _id: user_id });
        const cartData = await Cart.findOne({ _id: user_id });

        if (!cartData || !cartData.cart) {
            res.status(400).send("Cart data or items not found");
            return;
        }

        const address = req.body.address;
        const payment = req.body.payment;

        if (payment === 'cashOnDelivery') {
            // Ensure cartData.cart is an array before using map
            const items = Array.isArray(cartData.cart) ? cartData.cart.map(cartItem => ({
                product: cartItem.product_id,
                name: cartItem.name,
                quantity: cartItem.quantity,
                price: cartItem.price
            })) : [];

            const order = new Order({
                customer: user_id,
                status: 'pending',
                paymentMethod: payment,
                orderAddress: address,
                totalAmount: cartData.total_price,
                items: items
            });

            const orderData = await order.save();

            if (orderData) {
                // Clear the cart after placing the order
                await Cart.findByIdAndUpdate({ _id: user_id }, { cart: [], total_price: 0 });
            }

            res.render('orderConfirmation', { user: userData });
        } else {
            res.redirect('/shoppingCart/checkout');
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};






module.exports = {
    confirmOrder
}