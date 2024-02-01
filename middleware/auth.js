const User = require('../models/userModel');

const isLogin = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            const userData = await User.findById(req.session.user_id);
            
            if (userData && userData.status.toString() === 'false') {
                req.session.destroy(); // Log out the user if blocked
                return res.redirect('/');
            }

            next();
        } else {
            return res.redirect('/');
        }
    } catch (error) {
        console.log(error.message);
        res.redirect('/');
    }
};

const isLogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            return res.redirect('/home');
        }
        next();
    } catch (error) {
        console.log(error.message);
        res.redirect('/');
    }
};

module.exports = {
    isLogin,
    isLogout
};


// previous auth with bug while opening in new tab
// const isLogin = async(req,res,next)=>{

//     try {
        
//         if(req.session.user_id) {

//         } else {
//             return res.redirect('/')
//         }
//         next()
//     } catch (error) {
//         console.log(error.message);
//     }

// }


// const isLogout = async(req,res,next)=>{

//     try {
        
//         if(req.session.user_id) {
//             return res.redirect('/home')
//         }
//         next()
//     } catch (error) {
//         console.log(error.message);
//     }

// }

// module.exports = {
//     isLogin,
//     isLogout
// }