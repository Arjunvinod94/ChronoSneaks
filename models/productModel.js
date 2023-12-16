const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true,
    },
    images:{
        type: [String],
        required:true,
    },
    description:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required: true,
    },
    brand:{
        type:String,
        required: true,
    },
    discount:{
        type: Number,
        required: false,
    },
    status:{
        type: Boolean,
        requried: true,
    },
    stock:{
        type: Number,
        required: true,
    },
    created_at:{
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Product',productSchema)