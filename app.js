if(process.env.NODE_ENV !== 'production'){
    
    require('dotenv').config();   
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport= require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");





// require from routes folder for listngs and reviews all neessary things
const listingsRouter= require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");



const dbUrl = process.env.ATLASDB_URL;



main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const sessionOptions = {
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true
    }
};



app.use(session(sessionOptions));
app.use(flash());

// for passport section
app.use(passport.initialize());
app.use(passport.session());
//for user signup and login ---> means authentication
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





// Creating middlewares for flash messages
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter);

// if all above dose not match then 
// Standard response  as a form of  middleware
app.all("*", (req,res,next) => {
    next(new ExpressError(404,"page Not Found"));
});

// Error Handleing Middleware
app.use((err,req,res,next)=>{
    let {statusCode =500,message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs" ,{message});
    // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("server is listening to the port 8080");
});
