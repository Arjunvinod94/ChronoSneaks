const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const randomstring = require('randomstring')
const config = require('../config/config')
const nodemailer = require('nodemailer')

//password hashing
const securePassword = async(password)=>{
    try {

        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash

    } catch (error) {
        console.log(error.message);
    }
}

//for send mail

const addUserMail = async(name, email, password, user_id)=>{

    try {
        
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:'chronosneaks@gmail.com',
                pass:'fnpn eqbf ikiv spaw'
            }
        })
        const mailOptions = {
            from: 'chronosneaks@gmail.com',
            to: email,
            subject: 'For Verifying the mail',
            html: '<p>Hi '+name+', here is your link for the verification of ChronoSneaks <a href = "http://localhost:3000/verify?id='+user_id+'"> Verify </a></p> <br><br> <b>Email:</b>'+email+'<br><b>Password:</b>'+password+''
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

//admin login
const loadLogin = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}

//verify admin login
const verifyLogin = async(req,res)=>{
    try {
        
        const email = req.body.email
        const password = req.body.password

        const userData = await User.findOne({email:email})
        if(userData){

            const passwordMatch = await bcrypt.compare(password,userData.password)
            
            if(passwordMatch){

                if(userData.is_admin === 0){
                    res.render('login',{message:"Email and password is incorrect"})
                }else{
                    req.session.admin_id = userData._id
                    res.redirect('/admin/home')
                }

            }else{
                res.render('login',{message:"Email and password is incorrect"})
            }

        }else{
            res.render('login',{message:"Email and password is incorrect"})
        }

    } catch (error) {
        console.log(error.message);
    }
}

//admin Dashboard(Home)
const loadDashboard = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.admin_id})
        res.render('home',{admin:userData})

    } catch (error) {
        console.log(error.message);
    }
}

//admin logout

const logout = async(req,res)=>{
    try {
        
        req.session.destroy()
        res.redirect('/admin')

    } catch (error) {
        console.log(error.message);
    }
}

// admin dashboard for user management
const adminDashboard = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.admin_id})
        const usersData = await User.find({is_admin:0})
        res.render('dashboard',{users:usersData,admin:userData})
    } catch (error) {
        console.log(error.message);
    }
}

//admin add new user(get)
const newUserLoad = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.admin_id})
        res.render('new-user',{admin:userData})
    } catch (error) {
        console.log(error.message);
    }
}

//(post)
const addUser = async(req,res)=>{
    try {

        const name = req.body.name
        const email = req.body.email
        const mno = req.body.mno
        const password = randomstring.generate(8)

        const spassword = await securePassword(password)

        const user = new User({
            name:name,
            email:email,
            mobile:mno,
            password:spassword,
            is_admin:0
        })

        const userData = await user.save()

        if(userData){
            addUserMail(name, email, password, userData._id)
            res.redirect('/admin/dashboard')

        }else{
            res.render('new-user',{message:'Something Wrong'})
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

//admin edit user(get)
const editUserLoad = async(req,res)=>{
    try {
        const id = req.query.id

        const adminData = await User.findById({_id:req.session.admin_id})
        const userData = await User.findById({_id:id,})
        if(userData){
            res.render('edit-user',{user:userData, admin:adminData})
        }else{
            res.redirect('/admin/dashboard')
        }

    } catch (error) {
        console.log(error.message);
    }
}

//admin edit user (post)
const updateUsers = async(req,res)=>{
    try {

        const userData = await User.findByIdAndUpdate({ _id:req.body.id },{$set:{ name:req.body.name, email:req.body.email, mobile:req.body.mno, is_verified:req.body.verify }})
        
        res.redirect('/admin/dashboard')

    } catch (error) {
        console.log(error.message);
    }
}

// delete user
const deleteUser = async(req,res)=>{
    try {
        
        const id = req.query.id
        await User.deleteOne({ _id:id })
        res.redirect('/admin/dashboard')

    } catch (error) {
        console.log(error.message);
    }
}

// block/unblock user
const blockUnblockUser = async(req,res)=>{
    try {
        
        const id = req.query.id
        const userData = await User.findOne({_id:id})

        if(!userData){
            res.render('404',{message:'User not found'})
        }else{
            const updatedStatus = !userData.status
            const updatedUser = await User.updateOne({_id:id},{$set:{status:updatedStatus}})
            res.redirect('/admin/dashboard')
        }


    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser,
    blockUnblockUser
}