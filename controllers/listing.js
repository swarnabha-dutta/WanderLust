
// controllers/listing.js code

const Listing = require("../models/listing");  
const Review = require("../models/review");  

// Index Route  
module.exports.index = async (req, res) => {  
    const allListings = await Listing.find({});  
    res.render("listings/index.ejs", { allListings });  
};  

// Show Route  
module.exports.show = async (req, res) => {  
    const { id } = req.params; // Get the ID from the URL params  
    const listing = await Listing.findById(id).populate({  
        path: 'reviews',  
        populate: { path: 'author' }  
    }).populate('owner');  

    if (!listing) {  
        req.flash("error", "Listing not found."); // This triggers if the listing is not found  
        return res.redirect("/listings");  
    }  

    res.render("listings/show.ejs", { listing });  
};


// // Create Route  
// module.exports.create = async (req, res) => {  
//  console.log(req.body.listing);
//       const listing = new Listing(req.body.listing); // Ensure you're using req.body.listing  
//       listing.owner = req.user._id; // Set the owner  
//       await listing.save(); // Save the listing  
//       req.flash("success", "Listing created successfully!");  
//       res.redirect(`/listings/${listing._id}`); // Redirect to the new listing's page  
//   };
// Create Route  
module.exports.create = async (req, res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image= {url,filename};
    await newListing.save();
    req.flash("success", "New Listing created successfully!");
    res.redirect("/listings");
};

// Edit Route  
module.exports.edit = async (req, res) => {  
    let { id } = req.params;  
    const listing = await Listing.findById(id);  
    if (!listing) {  
        req.flash("error", "Listing not found.");  
        return res.redirect("/listings");  
    }  
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing , originalImageUrl});  
};  

// // Update Route  
// module.exports.update = async (req, res) => {  
//     let { id } = req.params;  
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });  
//     req.flash("success", "Listing updated successfully!");
//     res.redirect(`/listings/${id}`);  
// };  



// Update Route  
module.exports.update = async (req, res) => {  
    let { id } = req.params;  
    let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });  
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
    }
    await listing.save();
    req.flash("success", "Listing updated successfully!");  
    res.redirect(`/listings/${id}`);  
};

// Delete Route  
module.exports.delete = async (req, res) => {  
    let { id } = req.params;  
    let deletedListing = await Listing.findByIdAndDelete(id);  
    if (!deletedListing) {  
        req.flash("error", "Listing not found.");  
        return res.redirect("/listings");  
    }  
    req.flash("success", "Listing deleted successfully!");  
    res.redirect("/listings");  
};
