const User = require('../models/userModel')
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Address = require('../models/addressModel')
const Order = require('../models/orderModel')

const bcrypt = require("bcrypt")
const randomstring = require('randomstring')
const nodemailer = require("nodemailer")
const UserOTPVerification = require('../models/userOtpVerification') 

const config = require('../config/config')

const securePassword = async(password)=>{

    try{

        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash

    } catch(error){
        console.log(error.message);
    }
}

//otp mail
const generateOTP = ()=>{
    return Math.floor(1000 + Math.random() * 9000).toString()
}
const sendOTPMail = async(email, otpCode)=>{
    try {
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user: config.emailUser,
                pass: config.emailPassword
            }
        })
        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'For Verifying the mail',
            text: `Here is your OTP for ChronoSneaks registration : ${otpCode}`,
        }
        transporter.sendMail(mailOptions, (error,info)=>{
            if(error){
                console.log(error);
            } else {
                console.log("Email has been sent",info.response);
            }
        })
    } catch (error) {
        
    }
}
const generateAndSendOTP = async (email) => {
    try {
        const otpCode = generateOTP()
        const otpExpiration = new Date(Date.now() + 600000)

        await UserOTPVerification.updateOne({ email }, { otpCode, otpExpiration }, { upsert: true })
        sendOTPMail(email, otpCode)
    } catch (error) {
        console.log(error.message);
    }

}


const loadRegister = async(req,res)=>{
    try{

        res.render('registration')

    } catch(error) {
        console.log(error.message);
    }
}

// Insert User

const insertUser = async(req,res)=>{
    try {
        const email = req.body.email
        const mobile = req.body.mno
        const existingUser = await User.findOne({$or:[{email:email},{mobile:mobile}]})
        if(existingUser){
            res.render('registration',{errorMessage:"User Already Exist"})
        }else{
            const password = req.body.password
        const confirmPassword = req.body.confirmPassword

        if(password === confirmPassword){
            const spassword = await securePassword(req.body.password)
            const user = new User({
                        name:req.body.name,
                        email:req.body.email,
                        mobile:req.body.mno,
                        password:spassword,
                        is_admin:0,
                    })
                    const userData = await user.save()
                    if(userData) {

                        //email verification
                        // sendVerifyMail(req.body.name, req.body.email, userData._id)

                        //otp
                        generateAndSendOTP(req.body.email)
                
                        res.redirect(`/verifyOTP?_id=${userData._id}&email=${userData.email}`)
                    } else {
                        res.render('registration',{errorMessage:"Your registration has been failed"})
                    }
        }else{
            res.render('registration',{errorMessage:"Password Doesn't Match"})
        }
        }
        

    } catch (error) {
        console.log(error.message);
    }
}

//verify otp (post)
const verifyOTP = async(req,res)=>{
    try {
        const id = req.query._id
        const email = req.query.email
        const otp = req.body.otp1 + req.body.otp2 + req.body.otp3 + req.body.otp4

        const userData = await User.findOne({_id:id})
        const OTPData = await UserOTPVerification.findOne({
            email: email,
            otpCode: otp
        })

        if(!userData || !otp) {
            console.log('Invalid OTP or user already verified');
            return res.render('verifyOTP',{message:'invalid OTP or user already verified'})
        }
        if(userData && OTPData && OTPData.otpCode === otp) {
            await User.updateOne({_id: id},{$set:{is_verified: true}})
            await UserOTPVerification.deleteOne({_id: OTPData._id})
            
            res.redirect('/login')
        } else {
            return res.render('verifyOTP',{message:'invalid OTP'})
        }

    } catch (error) {
        console.log(error.message);
    }
}

//resend otp
const loadResendOTP = async(req,res)=>{
    try {
        const email = req.query.email
        const currentTime = new Date()
        console.log(email)
        const deleteOtp = await UserOTPVerification.deleteOne(
            { email: email },
            { otpExpiration: { $lt: currentTime } })
            console.log("Expired OTP deleted");

            if(deleteOtp) {
                generateAndSendOTP(email)
            }
    } catch (error) {
        console.log(error.message);
    }
}

//user login

const loginLoad = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}

//login verify
const verifyLogin = async(req,res)=>{
    try {

        const email = req.body.email
        const password = req.body.password

        const userData = await User.findOne({email:email})
        if(userData){

            const passwordMatch = await bcrypt.compare(password,userData.password)
            if(passwordMatch){
                if(userData.is_verified === 0){
                    res.render('login',{message:"Please verify your email"})
                }else{
                        if(userData.status.toString() === 'false'){
                            res.render('login',{message:'The user is temporarily restricted'})
                        } else {
                            req.session.user_id = userData._id
                            res.redirect('/home')
                        }
                }
            } else {
                res.render('login',{message:"Check your email and password"})
            }

        }else {
            res.render('login',{message:"Check your email and password"})
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

//for reset password send mail
const sendResetPasswordMail = async(name, email, token)=>{

    try {
        
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user: config.emailUser,
                pass: config.emailPassword
            }
        })
        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'For Reset Password',
            html: '<p>Hi '+name+', please click here to <a href = "http://localhost:3000/forget-password?token='+token+'"> Reset your password </a></p>',
        }
        transporter.sendMail(mailOptions, (error,info)=>{
            if(error){
                console.log(error);
            } else {
                console.log("Email has been sent",info.response);
            }
        })

    } catch (error) {
        console.log(error.message);
    }
}

//for user forgot password(get)
const forgetLoad = async(req,res)=>{
    try {

        res.render('forget')
        
    } catch (error) {
        console.log(error.message);
    }
}
//forgot password(post)
const forgetVerify = async(req,res)=>{
    try {

        const email = req.body.email
        const userData = await User.findOne({email:email})

        if(userData){
            if(userData.is_verified === 0){
                res.render('forget',{message:'Please verify your email'})
            }else{
                const randomString = randomstring.generate()
                const updatedData = await User.updateOne({email:email},{$set:{token:randomString}})
                sendResetPasswordMail(userData.name,userData.email,randomString)
                res.render('forget',{verifyMessage:'Please check your email to reset your password'})
            }
        }else{
            res.render('forget',{message:'User email is incorrect'})
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

// forget-password page(get)
const forgetPasswordLoad = async(req,res)=>{
    try {
        
        const token = req.query.token
        const tokenData = await User.findOne({token:token})
        if(tokenData){
            res.render('forget-password',{user_id:tokenData._id})
        }else{
            res.render('404',{message:'Token is invalid'})
        }
    } catch (error) {
        console.log(error.message);
    }
}

// forget-password(post)
const resetPassword = async(req,res)=>{
    try {
        const password = req.body.password
        const confirmPassword = req.body.confirmPassword
        const user_id = req.body.user_id

        if(password === confirmPassword){
            const secure_password = await securePassword(password)
            const updateData = await User.findByIdAndUpdate({_id:user_id},{password:secure_password, token:''})
            res.redirect('/login')
        }else{
            res.render('forget-password',{message:"Password doesn't match",user_id})
        }

    } catch (error) {
        console.log(error.message);
    }
}

//for user home
const loadHome = async(req,res)=>{
    try {

        //user data - 7/12/23
        const userData = await User.findById({ _id:req.session.user_id})
        
        res.render('home',{ user:userData })

    } catch (error) {
        console.log(error.message);
    }
}

//user logout
const userLogout = async(req,res)=>{
   try {
    
    req.session.destroy()
    res.redirect('/')

   } catch (error) {
        console.log(error.message);
   } 
}

//user profile edit & update
const editLoad = async(req,res)=>{
    try {

        const id = req.query.id || req.session.user_id
        const userData = await User.findById({ _id:id })
        
        if(userData) {
            res.render('edit',{user:userData})
        } else {
            res.redirect('/home')
        }

    } catch (error) {
        console.log(error.message);
    }
}

const updateProfile = async(req,res)=>{
    try {
    //some changes (not including if-else)
            const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name, email:req.body.email, mobile:req.body.mno}})
            res.redirect('/home')

    } catch (error) {
        console.log(error.message);
    }
}

const loadUpdatePassword = async(req,res)=>{
    try {
        const user_id = req.session._id
        const userData = await User.find({_id: user_id})

        res.render('update-password',{user : userData})
    } catch (error) {
        console.log(error.message);
    }
}

const loadAddress = async(req,res)=>{
    try {
        const user_id = req.session.user_id
        const userData = await User.find({_id: user_id})
        const addressData = await Address.findOne({user_id: user_id})
        res.render('address',{user: userData, addressData})
        
    } catch (error) {
        console.log(error.message);
    }
}

const loadAddAddress = async(req,res)=>{
    try {
        user_id = req.session.user_id
        userData = await User.findById({_id: user_id})

        res.render('add-address',{user: user_id})
    } catch (error) {
        console.log(error.message);
    }
}

const verifyAddAddress = async(req,res)=>{
    try {
        const user_id = req.session.user_id
        const addressObj = {
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            zipcode: req.body.zipcode,
            mobile: req.body.mobile,
          }

          const addressData = await Address.findOne({user_id: user_id})
          if(addressData) {
            await Address.findOneAndUpdate(
                {user_id: user_id},
                {$push: {address: addressObj}}
            )
            res.redirect('/edit/address')
          } else {
            const address = new Address({
                user_id: user_id,
                address: addressObj
            })
            const savedAddress = await address.save()
            res.redirect('/edit/address')
          }
        
    } catch (error) {
        console.log(error.message);
    }
}

// problems in edit address

const loadEditAddress = async(req,res)=>{
    try {
        const user_id = req.session.user_id
        const userData = await User.findById({_id: user_id})
        const address = req.query.id
        const addressData = await Address.findOne({'address.address': address})

        res.render('edit-address',{user: userData, addressData})
        
    } catch (error) {
        console.log(error.message);
    }
}

const deleteAddress = async(req,res)=>{
    try {
        const user_id = req.session.user_id
        const address = req.query.id
        const addressData = await Address.findOne({
            user_id: user_id,
        })
        if(addressData) {
            const deleteAddress = await Address.updateOne(
                {user_id: user_id},
                {$pull: {address: {address: address}}}
            )
            if(deleteAddress) {
                res.redirect('/edit/address')
            } else {
                res.render('404')
            }
        } else {
            console.log("couldn't find data");
        }

        
    } catch (error) {
        console.log(error.message);
    }
}

const verifyUpdatePassword = async (req, res) => {
    try {
        const user_id = req.session.user_id;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;

        const data = await User.findOne({ _id: user_id });

        if (!data) {
            return res.status(404).send({ success: false, msg: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(oldPassword, data.password);

        if (passwordMatch) {
            if (newPassword === confirmPassword) {
                const updatePassword = await securePassword(newPassword);

                const userData = await User.findByIdAndUpdate(
                    { _id: user_id },
                    { $set: { password: updatePassword } }
                );

                if (userData) {
                    console.log("Password successfully changed");
                    return res.redirect('/home');
                } else {
                    return res.status(500).send({ success: false, msg: "Error updating password" });
                }
            } else {
                return res.render('update-password', { message: "Both Passwords Don't Match", user: data });
            }
        } else {
            return res.render('update-password', { message: "Old Password Incorrect", user: data });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

//my orders
const loadMyOrders = async(req,res)=>{
    try {
        const user_id = req.session.user_id
        const userData = await User.findById({_id: user_id})
        const orderData = await Order.find({customer: user_id})
        // console.log(user_id, orderData);
        res.render('my-orders',{user: userData, orderData})
    } catch (error) {
        console.log(error.message);
    }
}

const loadCancelOrder = async(req,res)=>{
    try {
        const product_id = req.query.id

        if(product_id) {
            await Order.updateOne({_id: product_id},{$set:{status: 'Cancelled'}})
            res.redirect('/home/myOrders')
        } else {
            res.redirect('/home/myOrders')
            console.log('Unable to cancel product');
        }
    } catch (error) {
        console.log(error.message);
    }
}


//otp verification
const loadVerify = async(req,res)=>{
    try {
        res.render('verifyOTP')
    } catch (error) {
        console.log(error.message);
    }
}

//products
const loadWatchCategory = async (req, res) => {
    try {
      const userData = await User.findById({ _id: req.session.user_id });
      
      const page = parseInt(req.query.page) || 1;
      const pageSize = 3; // Adjust the number of products per page as needed
  
      // Sorting options
      const validSortOptions = ['price', 'name', 'date'];
      const sortBy = validSortOptions.includes(req.query.sortBy) ? req.query.sortBy : 'date';
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
        
      var search = ''
      if(req.query.productSearch){
        search = req.query.productSearch
      }
      // Fetch paginated and sorted product data
      const productData = await Product.find({ 
        category: 'Watches',
        $or:[
            { name:{$regex:'.*'+search+'.*',$options:'i'}},
            { brand:{$regex:'.*'+search+'.*',$options:'i'}},
        ]
     })
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * pageSize)
        .limit(pageSize);
  
      // Get total number of products for pagination information
      const totalProducts = await Product.countDocuments({ category: 'Watches' });
      const totalPages = Math.ceil(totalProducts / pageSize);
  
      res.render('watchCategory', {
        user: userData,
        products: productData,
        currentPage: page,
        totalPages: totalPages,
        sortBy: sortBy,
        sortOrder: sortOrder === -1 ? 'desc' : 'asc',
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
    }
  };
  

  const loadSneakerCategory = async (req, res) => {
    try {
      const userData = await User.findById({ _id: req.session.user_id });
  
      const page = parseInt(req.query.page) || 1;
      const pageSize = 3; // Adjust the number of products per page as needed
  
      // Sorting options
      const validSortOptions = ['price', 'name', 'date'];
      const sortBy = validSortOptions.includes(req.query.sortBy) ? req.query.sortBy : 'date';
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
        
      var search = ''
      if(req.query.productSearch){
        search = req.query.productSearch
      }
      // Fetch paginated and sorted product data
      const productData = await Product.find({
        category: 'Sneakers',
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {brand:{$regex:'.*'+search+'.*',$options:'i'}},
        ]
    })
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * pageSize)
        .limit(pageSize);
  
      // Get total number of products for pagination information
      const totalProducts = await Product.countDocuments({ category: 'Sneakers' });
      const totalPages = Math.ceil(totalProducts / pageSize);
  
      res.render('sneakerCategory', {
        user: userData,
        products: productData,
        currentPage: page,
        totalPages: totalPages,
        sortBy: sortBy,
        sortOrder: sortOrder === -1 ? 'desc' : 'asc',
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
    }
  };
  

const loadWatchView = async(req,res)=>{
    try {
        const id = req.query.id
        const userData = await User.findById({ _id:req.session.user_id})
        const ProductData = await Product.findById({_id:id})
        

        res.render('watchView',{ user:userData,products: ProductData})
    } catch (error) {
        console.log(error.message);
    }
}


const loadSneakerView = async(req,res)=>{
    try {
        const id = req.query.id
        const userData = await User.findById({ _id:req.session.user_id})
        const ProductData = await Product.findById({_id:id})
        

        res.render('sneakerView',{ user:userData,products: ProductData})
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    verifyOTP,
    loginLoad,
    verifyLogin,
    loadResendOTP,

    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    loadHome,
    userLogout,
    editLoad,
    updateProfile,
    loadUpdatePassword,
    verifyUpdatePassword,
    loadAddress,
    loadAddAddress,
    verifyAddAddress,
    loadEditAddress,
    deleteAddress,
    loadMyOrders,
    loadCancelOrder,

    loadVerify,
    loadWatchCategory,
    loadSneakerCategory,
    loadWatchView,
    loadSneakerView,
}