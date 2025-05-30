// const joi = require('joi');

// module.exports.listingschema = joi.object({
//     listing : joi.object({
//         title: joi.string().min(3).max(30).required(), 
//         description: joi.string().min(3).max(1000).required(),
//         price: joi.number().min(0).required(),
//         location: joi.string().min(3).max(100).required(),
//         image: joi.string().allow(null, '').optional(),
//     }).required()
// });

const Joi = require('joi');

module.exports.listingschema = Joi.object({
  title: Joi.string().min(3).max(30).required(), 
  description: Joi.string().min(3).max(1000).required(),
  price: Joi.number().min(0).required(),
  location: Joi.string().min(3).max(100).required(),
  country: Joi.string().min(2).max(50).required(),  // included from your form
  image: Joi.string().uri().allow('', null).optional()
});

module.exports.reviewschema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comments: Joi.string().min(3).max(500).required()
});
