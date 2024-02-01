const isLogin = async(req,res,next)=>{
    try {
        
        if(req.session.admin_id){ // 02/02/2024 - created admin_id instead of user_id

        }else{
            return res.redirect('/admin')
        }
        next()
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async(req,res,next)=>{
    try {
        
        if(req.session.admin_id){
            return res.redirect('/admin/home')
        }
        next()

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isLogin,
    isLogout
}