const express = require('express')
const admin_route = express()

const session = require('express-session')
const config = require('../config/config')
admin_route.use(session({
    secret: config.adminSessionSecret,
    resave: false, // Set to false to avoid deprecation warning
    saveUninitialized: false, // Set to false to avoid deprecation warning
  }));

const bodyParser = require('body-parser')
admin_route.use(bodyParser.json())
admin_route.use(bodyParser.urlencoded({extended:true}))

admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin')

const multer = require('multer')
const path = require('path')
admin_route.use(express.static('public'))

const auth = require('../middleware/adminAuth')

const adminController = require('../controllers/adminController')
const categoryController = require('../controllers/categoryController')
const productController = require('../controllers/productController')

// Define storage for product images
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/images/productImages'),function(err,success){
            if(err){
              throw err
            }
        })
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname
        cb(null,name,function(error,success){
            if(error){
                throw error
            }
        })
    }
})

const upload = multer({storage:storage})

//admin login
admin_route.get('/',auth.isLogout,adminController.loadLogin)
admin_route.post('/',adminController.verifyLogin)

//admin home
admin_route.get('/home',auth.isLogin,adminController.loadDashboard)

admin_route.get('/logout',auth.isLogin,adminController.logout)

//admin dashboard
admin_route.get('/dashboard',auth.isLogin,adminController.adminDashboard)

//admin add new user
admin_route.get('/new-user',auth.isLogin,adminController.newUserLoad)
admin_route.post('/new-user',adminController.addUser)

//admin edit user
admin_route.get('/edit-user',auth.isLogin,adminController.editUserLoad)
admin_route.post('/edit-user',adminController.updateUsers)

//delete user
admin_route.get('/delete-user',adminController.deleteUser)

//block-unblock user
admin_route.get('/block-unblock-user',auth.isLogin,adminController.blockUnblockUser)

//category page
admin_route.get('/category',auth.isLogin,categoryController.loadCategory)
admin_route.get('/category/new-category',auth.isLogin,categoryController.loadAddNewCategory)
admin_route.post('/category/new-category',categoryController.verifyAddNewCategory)
admin_route.get('/category/edit-category',auth.isLogin,categoryController.editCategoryLoad)
admin_route.post('/category/edit-category',categoryController.updateCategoryLoad)
admin_route.get('/category/delete-category',auth.isLogin,categoryController.deleteCategory)
// admin_route.post('/category/edit-category',categoryController.editCategoryUpdate)

//product page
admin_route.get('/products',auth.isLogin,productController.loadProduct)
admin_route.get('/products/new-product',auth.isLogin,productController.loadAddNewProduct)
admin_route.post('/products/new-product',upload.array('images'),productController.updateAddNewProduct)

admin_route.get('/products/view-product',auth.isLogin,productController.adminSingleProductView)
admin_route.get('/products/edit-product',auth.isLogin,productController.editProductLoad)
admin_route.post('/products/edit-product',upload.array('images'),productController.updateEditProduct)
admin_route.get('/products/delete-product',auth.isLogin,productController.deleteProduct)
//always loaad admin when wrong route is entered (used last)
admin_route.get('*',(req,res)=>{
    res.redirect('/admin')
})

module.exports = admin_route