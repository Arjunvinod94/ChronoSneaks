const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model for customers
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'Cancelled', 'returned'],
        default: 'pending'
    },

    paymentMethod: {
        type: String,
        enum: ['creditCard', 'payPal', 'cashOnDelivery'],
        required: true
    },
    orderAddress: {
        type: String
    },

    totalAmount: {
        type: Number,
        
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Assuming you have a Product model
                
            },
            name:{
                type: String,
            },
            quantity: {
                type: Number,
                
            },
            price: {
                type: Number,
                
            }
        }
    ]

});




module.exports = mongoose.model('Order', orderSchema);