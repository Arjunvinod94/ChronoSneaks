const User = require('../models/userModel')
const bcrypt = require("bcrypt")

const nodemailer = require("nodemailer")

const securePassword = async(password)=>{

    try{

        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash

    } catch(error){
        console.log(error.message);
    }
}

//for send mail

const sendVerifyMail = async(name, email, user_id)=>{

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
            html: '<p>Hi '+name+', here is your link for the verification of ChronoSneaks <a href = "http://localhost:3000/verify?id='+user_id+'"> Verify </a></p>',
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

//end

const loadRegister = async(req,res)=>{
    try{

        res.render('registration')

    } catch(error) {
        console.log(error.message);
    }
}

const insertUser = async(req,res)=>{

try{
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

        sendVerifyMail(req.body.name, req.body.email, userData._id)

        //end

        res.render('registration',{message:"Your registration has been successfull. Please verify your email"})
    } else {
        res.render('registration',{message:"Your registration has been failed"})
    }

} catch(error) {
    console.log(error.message);
}

}

//for emailVerification
const verifyMail = async(req,res)=>{
    try {
        
        const updatedInfo = await User.updateOne({_id:req.query.id},{$set:{is_verified:1}})
        console.log(updatedInfo)
        res.render("email-verified")

    } catch (error) {
        console.log(error.message);
    }
}
//end

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
                    req.session.user_id = userData._id
                    res.redirect('/home')
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

        const id = req.query.id
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

module.exports = {
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editLoad,
    updateProfile
}