const Joi = require('joi');



// module.exports.listingSchema = Joi.object({
//     listing : Joi.object({
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         location: Joi.string().required(),
//         image: Joi.string().allow("", null),
//         country: Joi.string().required(),
//         price: Joi.number().required().min(0),
//     }).required(),
// });

// chatGPT
// Schema for listing validation
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string()
            .min(3)
            .max(100)
            .required(),
        description: Joi.string()
            .required(),
        location: Joi.string()
            .required(),
            image: Joi.string().allow("").optional(),
        country: Joi.string()
            .required(),
        price: Joi.number()
            .min(0)
            .required()
    }).required()
});


module.exports.reviewSchema= Joi.object({
    review: Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
        // createdAt: Joi.string().required(),        
    }).required(),
})