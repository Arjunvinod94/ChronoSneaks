const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const User = require('../models/userModel')
const fs = require('fs')
const path = require("path");

const loadProduct = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id})
        const usersData = await User.find({is_admin:0})
        const ProductData = await Product.find({}).populate('category')
        if(ProductData) {
            res.render('products',{ProductData,users:userData,admin:usersData})
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loadAddNewProduct = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id})
        const usersData = await User.find({is_admin:0})
        const category = await Category.find({})
        const ProductData = await Product.find({})
        res.render('new-product',{category,users:usersData,admin:userData,ProductData})
    } catch (error) {
        console.log(error.message);
    }
}

// const updateAddNewProduct = async(req,res)=>{
//     try {
//         const {name, description, price, brand, status, stock, category} = req.body
//         console.log(name, description, price, brand, status, stock, category);

//             const ProductData = new Product({
//                 name: name,
//                 description: description,
//                 price: parseFloat(price),
//                 category: category,
//                 brand: brand,
//                 status: status,
//                 stock: parseInt(stock)

//             })

//         await ProductData.save()
//         res.redirect('/admin/products')
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const updateAddNewProduct = async(req,res)=>{
    try {

        var arrImages = []
        for(let i=0;i<req.files.length;i++){
            arrImages[i] = req.files[i].filename
        }

        var product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            discount: req.body.discount,
            category: req.body.category,
            images: arrImages,
            brand: req.body.brand,
            status: req.body.status,
            stock: req.body.stock
        })

        const productData = await product.save()
        res.redirect('/admin/products')
        
    } catch (error) {
        console.log(error.message);
    }
}

const deleteProduct = async(req,res)=>{
    try {
        const id = req.query.id;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (deletedProduct) {
            const imageFilenames = deletedProduct.images; 
            const imageFolderPath = path.join(__dirname, '../public/images/productImages');

            const fs = require('fs');
            imageFilenames.forEach((filename) => {
                const imagePath = path.join(imageFolderPath, filename);

                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log(`Deleted image file: ${imagePath}`);
                } else {
                    console.log(`Image file not found: ${imagePath}`);
                }
            });

            res.redirect('/admin/products');
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

const editProductLoad = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id})
        const usersData = await User.find({is_admin:0})
        const id = req.query.id

        const ProductData = await Product.findById({_id:id})
        const category = await Category.find({})
        if(ProductData){
            res.render('edit-product',{ProductData,category,users:usersData, admin:userData})
        }else{
            res.redirect('/admin/products')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const updateEditProduct = async(req,res)=>{
    try {

        var arrImages = []
        for(let i=0;i<req.files.length;i++){
            arrImages[i] = req.files[i].filename
        }

        const id = req.query.id
        const name = req.body.name
        const description = req.body.description
        const price = req.body.price
        const discount = req.body.discount
        const category = req.body.category
        const images = arrImages
        const brand = req.body.brand
        const status = req.body.status
        const stock = req.body.stock

        // const updatedProducts = {name: name, description: description, price: price, discount: discount, category: category,images: images,brand: brand,status: status, stock: stock}
        // const updatedResult = await Product.findByIdAndUpdate({_id: id},updatedProducts,{new: true})

        const updatedProducts = {
            name: name,
            description: description,
            price: price,
            discount: discount,
            category: category,
            images: images,
            brand: brand,
            status: status,
            stock: stock
          };
          
          // Check if new images were uploaded
        //   if (req.files && req.files.length > 0) {
            // Handle new images (e.g., save to server or cloud storage)
            // Replace existing images in the product model with new ones
        //     updatedProducts.images = req.files.map(file => ({ filename: file.filename, originalname: file.originalname }));
        //   }
          
          const updatedResult = await Product.findByIdAndUpdate({ _id: id }, updatedProducts, { new: true });

        if(updatedResult){
            res.redirect('/admin/products')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const adminSingleProductView = async(req,res)=>{
    try {
        const id = req.query.id
        const userData = await User.findById({_id:req.session.user_id})
        const usersData = await User.find({is_admin:0})
        const ProductData = await Product.findById(id)
        const category = await Category.find({})
        if(ProductData){
            res.render('view-product',{ProductData, category, users:usersData, admin:userData})
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadProduct,
    loadAddNewProduct,
    updateAddNewProduct,
    editProductLoad,
    updateEditProduct,
    deleteProduct,
    adminSingleProductView
}