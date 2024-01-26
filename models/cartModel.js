const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
//     _id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//     },
//     product_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product", 
//     },
//     name:{
//         type: String,
//         required: true
//     },
//     quantity:{
//         type: Number,
//         required: true,
//         default: 1
//     },
//     price:{
//         type: Number,
//         required: true
//     },
//     image:{
//         type: String,
//         required: false
//     },
//     cancelled:{
//         type:Boolean,
//         default:false,
//     },
// })

_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
},
cart: [
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product", 
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
        name: {
            type: String,
            required: true,
        },
        
        image: {
            type: String,
            required: false,
        },
        price: {
            type: Number,
            required: true,
        },
        cancelled:{
            type:Boolean,
            default:false,
        },
      

    },
],
total_price: {
    type: Number,
    required:false,
},
});

module.exports = mongoose.model('Cart',cartSchema)