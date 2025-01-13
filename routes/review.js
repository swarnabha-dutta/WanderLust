// routes/review.js

const express = require("express");
const router = express.Router({mergeParams: true});  // Merge params allows us to access :id from parent route
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

// Import the review controller
const reviewController = require("../controllers/review.js");

// Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.post));

// Delete Review Route  
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.delete));

module.exports = router;
