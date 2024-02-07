const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const categoryModel = require('../models/categoryModel')

const loadCategory = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.admin_id})
        const usersData = await User.find({is_admin:0})
        const CategoryData = await Category.find({})
        if(CategoryData){
            res.render('category',{users:usersData, admin:userData, CategoryData})
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loadAddNewCategory = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.admin_id})
        const usersData = await User.find({is_admin:0})

        res.render('new-category',{users:usersData, admin:userData})
    } catch (error) {
        console.log(error.message);
    }
}
//post
const verifyAddNewCategory = async(req,res)=>{
    try {
        const name = req.body.name
        const description = req.body.description
        const subCategory = req.body.SubCategory

        const existingCategory = await Category.findOne({category:name})
        if(existingCategory) {
            existingCategory.sub_category.push(subCategory)
            const updatedCategory = await existingCategory.save()
            console.log('Updated Category : ',updatedCategory);
        }else{
            const newCategory = new Category({
                category: name,
                description: description,
                sub_category: [subCategory],
            })

            const newCategoryData = await newCategory.save()
            console.log('New Category : ', newCategoryData);
        }
        res.redirect('/admin/category')
    } catch (error) {
        console.log(error.message);
    }
}

const editCategoryLoad = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.admin_id})
        const usersData = await User.find({is_admin:0})
        const id = req.query.id

        const CategoryData = await Category.findById({_id:id})
        const category = await Category.find({})
        if(CategoryData){
            res.render('edit-category',{CategoryData,category,users:usersData, admin:userData})
        }else{
            res.redirect('/admin/category')
        }

    } catch (error) {
        console.log(error.message);
    }
}

// const updateCategoryLoad = async(req,res)=>{
//     try {
//         const CategoryData = Category.findByIdAndUpdate({_id:req.body.id},{$set:{category:req.body.name, sub_category:req.body.SubCategory, description:req.body.description}})
//         res.redirect('/admin/category')
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const updateCategoryLoad = async(req,res)=>{
    try {
        const id = req.query.id
        const name = req.body.name
        const SubCategory = req.body.SubCategory
        const description = req.body.description

        const updateFields = {category: name, description: description, sub_category: SubCategory}
        const updateResult = await Category.findByIdAndUpdate({_id: id},updateFields,{new: true})
        if(updateResult){
            res.redirect('/admin/category')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const deleteCategory = async(req,res)=>{
    try {
        const id = req.query.id
        const updatedCategory = await Category.deleteOne({_id:id})
        if(updatedCategory){
            res.redirect('/admin/category')
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadCategory,
    loadAddNewCategory,
    verifyAddNewCategory,
    editCategoryLoad,
    updateCategoryLoad,
    deleteCategory
}