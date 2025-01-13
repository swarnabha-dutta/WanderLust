const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// All listingController in modular fashion
const listingController = require("../controllers/listing.js");

// multer 
const multer  = require('multer');
const {storage}= require("../cloudConfig.js");
const upload = multer({ storage});
// Listing routes

// Merging steps
router
    .route("/")
    .get(wrapAsync(listingController.index))   // Index Route
    .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.create));//Create Route
     
// New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

router
    .route("/:id")
    .get(wrapAsync(listingController.show)) // Show Route
    .put(isLoggedIn, isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.update)) // Update Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete)); // Delete Route

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

module.exports = router;
