const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({

    category:{
        type:String,
        required:true,
    },
    sub_category:{
        type:[String],
        required:true,
    },
    image:{
        type:String,
    },
    description:{
        type:String,
        required:true
    },
    createdAt:{                    
        type:Date,
        default:Date.now,
      
    },

})

module.exports = mongoose.model('Category',categorySchema)