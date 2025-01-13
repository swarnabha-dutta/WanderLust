

const User = require("../models/user");





// get request route 
module.exports.getForSignUp=(req,res)=>{
    res.render("users/signup.ejs");
}

// Post request route
module.exports.postForSignUp= async(req,res)=>{
    try{
        let {username,email,password}= req.body;
        const newUser=await new User({username,email});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return   next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

// get request route 
module.exports.getForLogin = (req,res)=>{
    res.render("users/login.ejs");
}

// Post request route
module.exports.postForLogin  = async(req,res)=>{
    req.flash("success","Welcome Back to Wanderlust! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


// get request route 
module.exports.getForLogout = (req,res ,next)=>{
    req.logout((err)=>{
        if(err){
            return   next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
}
