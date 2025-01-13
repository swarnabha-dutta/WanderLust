// models/listing.js code

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true // Ensure description is required
    },
    image: {
      url:String,
      filename:String
    },
    price: {
        type: Number,
        required: true // Mark price as required
    },
    location: {
        type: String,
        required: true // Mark location as required
    },
    country: {
        type: String,
        required: true // Mark country as required
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // category:{
    //     type:String,
    //     enum:[
    //         "Trending",
    //         "Rooms",
    //         "Iconic cities",
    //         "Beach",
    //         "Top of the world",
    //         "Castle",
    //         "Arctic",
    //         "Camping",
    //         "Farms"
    //     ]
    // }
});

// Delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
