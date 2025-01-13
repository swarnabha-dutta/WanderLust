

// middleware.js

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

// Middleware to check if a user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {  // Check if user is authenticated via Passport.js
        req.session.redirectUrl = req.originalUrl;  // Save the URL they were trying to access
        req.flash("error", "You must be logged in to create new listing");
        return res.redirect("/login");
    }
    next();
};

// Middleware to save the redirect URL after login
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;  // Make redirectUrl available in the response
    }
    next();
};
// middleware.js  
module.exports.isOwner = async (req, res, next) => {  
    const { id } = req.params;  
    const listing = await Listing.findById(id);  
    if (!listing) {  
        req.flash("error", "Listing not found."); // Handle if listing is not found  
        return res.redirect("/listings");  
    }  
    if (!listing.owner.equals(res.locals.currUser._id)) {  
        req.flash("error", "You are not the owner of this listing");  
        return res.redirect(`/listings/${id}`);  
    }  
    next();  
};

// Middleware to validate a new listing (checking form data)
// Middleware to validate a new listing (checking form data)
module.exports.validateListing = (req, res, next) => {
    console.log(req.body);
       let { error } = listingSchema.validate(req.body);
       if (error) {
           let errMsg = error.details.map((el) => el.message).join(",");
           throw new ExpressError(404, errMsg);
       } else {
           next();
       }
   };
// Middleware to validate the review form (checking form data)
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
};

// Middleware to check if the current user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    let { reviewId, id } = req.params;  // Listing ID and Review ID
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};