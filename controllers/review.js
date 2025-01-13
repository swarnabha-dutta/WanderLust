// controllers/review.js

const Listing = require("../models/listing");
const Review = require("../models/review");

// Post Review Route
module.exports.post = async (req, res) => {  
    try {  
        // Fetch the listing by ID (based on URL param /listings/:id)
        let listing = await Listing.findById(req.params.id);  
        if (!listing) {  
            req.flash("error", "Listing not found.");  
            return res.redirect("/listings");  
        }

        // Create a new review object based on the form data
        let newReview = new Review(req.body.review);  
        newReview.author = req.user._id;  // Attach current logged-in user as author

        listing.reviews.push(newReview); // Add the review ID to the listing's reviews array
        await newReview.save();  // Save the new review
        await listing.save();  // Save the updated listing

        req.flash("success", "Review added successfully!");  
        res.redirect(`/listings/${listing._id}`);  
    } catch (error) {  
        console.error(error);  // Log the error in the backend
        req.flash("error", "An error occurred while adding the review.");  // Flash error to user
        res.redirect(`/listings/${req.params.id}`);  
    }  
};

// Delete Review Route
module.exports.delete = async (req, res) => {  
    const { id, reviewId } = req.params;  // Listing ID and Review ID

    // Check if the listing exists  
    const listing = await Listing.findById(id);  
    if (!listing) {  
        req.flash("error", "Listing not found.");  
        return res.redirect("/listings");  
    }

    // Check if the review exists  
    const review = await Review.findById(reviewId);  
    if (!review) {  
        req.flash("error", "Review not found.");  
        return res.redirect(`/listings/${id}`);  
    }

    // Remove the review from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });  
    await Review.findByIdAndDelete(reviewId);  // Delete the review

    req.flash("success", "Review deleted successfully!");  
    res.redirect(`/listings/${listing._id}`);  
};
