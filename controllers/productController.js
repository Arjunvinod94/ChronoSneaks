const Product = require('../models/productModel')

const addProducts = async(req,res)=>{
    try {
        const name = req.body.name
        const image = req.body.filename
        const description = req.body.description
        const price = req.body.price
        const category = req.body.category
        const brand = req.body.description
        const status = req.body.status
        const stock = req.body.stock

        const product = await Product.create({name,image,description,price,category,brand,status,stock})
        const productData = await product.save()

        return res.send(productData)
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    addProducts
}