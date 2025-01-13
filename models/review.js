// models/review.js code ::


const mongoose = require("mongoose")  
const Schema = mongoose.Schema;  

const reviewSchema = new Schema({  
    comment: String,  
    rating: {  
        type: Number,  
        min: 1,  
        max: 5,  
    },  
    createdAt: {  
        type: Date,  
        default: Date.now()  
    },  
    author: {  
        type: Schema.Types.ObjectId,  
        ref: "User",  
    },  
    listing: { // This will store the ID of the listing being reviewed  
        type: Schema.Types.ObjectId,  
        ref: 'Listing'  
    }  
});  

module.exports = mongoose.model("Review", reviewSchema);
