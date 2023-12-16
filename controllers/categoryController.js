const Category = require('../models/categoryModel')

const addCategory = async(req,res)=>{
    try {
        
        const name = req.body.name
        const sub_category = req.body.sub_category
        const image = req.body.filename
        const description = req.body.description
        
        const category = await Category.create({name,sub_category,description,image})
        return res.send(category)
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    addCategory
}