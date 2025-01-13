const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user.js');  // Import the User model
const wrapAsync= require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require('../middleware.js');





const userController = require("../controllers/users.js");

// below 2 routes  are for SignUp part 
router
    .route("/signup")
    .get(userController.getForSignUp)    // get request route    
    .post(wrapAsync(userController.postForSignUp));// Post request route

router
    .route("/login")
    .get(userController.getForLogin)    // get request route    
    .post(saveRedirectUrl ,passport.authenticate("local", { failureRedirect: '/login',failureFlash: true })  , userController.postForLogin);// Post request route


// below 2 routes  are for Logout part 

// get request route 
router.get("/logout",userController.getForLogout);

module.exports = router;
