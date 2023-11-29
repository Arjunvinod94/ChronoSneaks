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
module.exports = {
    loadRegister,
    insertUser,
    verifyMail
}