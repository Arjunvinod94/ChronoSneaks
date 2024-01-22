const mongoose = require('mongoose')

var productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    images:{
        type: Array,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        requried: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }

})

module.exports = mongoose.model('Product',productSchema)


// const productSchema = new mongoose.Schema({

//     name:{
//         type: String,
//         required: true,
//     },
//     images:{
//         type: [String],
//         required:true,
//     },
//     description:{
//         type: String,
//         required: true,
//     },
//     price:{
//         type: Number,
//         required: true,
//     },
//     category:{
//         type: String,
//         required: true,
//     },
//     brand:{
//         type:String,
//         required: true,
//     },
//     discount:{
//         type: Number,
//         required: false,
//     },
//     status:{
//         type: Boolean,
//         requried: true,
//     },
//     stock:{
//         type: Number,
//         required: true,
//     },
//     created_at:{
//         type: Date,
//         default: Date.now,
//     }
// })

// module.exports = mongoose.model('Product',productSchema)