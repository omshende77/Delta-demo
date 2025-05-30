const express = require('express');
const review = require('../models/review.js');
const {reviewschema} = require('../schema.js');
const listing = require('../models/listing.js');
const ExpressError = require('../utils/ExpressError.js');

// Create review
module.exports.createReview = async (req,res)=>{
    // console.log("REQ PARAMS:", req.params);
    // console.log("REQ BODY:", req.body);
    const { id } = req.params;
    const {comments ,rating} = req.body;
    const findlist = await listing.findById(id);
    if (!findlist) {
        throw new ExpressError(404, "Listing not found");
    }
    let newreview = new review({
        comments : comments,
        rating : rating,
        createdAt : Date.now() || undefined,
    });
    newreview.author = req.user._id; // Assuming you have the current user in res.locals.currUser
    console.log("New Review:", newreview);
    findlist.reviews.push(newreview);

    await newreview.save();
    await findlist.save();
    req.flash("success","Review added successfully");

    res.redirect(`/listings/${id}`);
};

//Delete review
module.exports.destroyReview = async (req,res)=>{
    
    const {id,reviewid} = req.params;
    
    await listing.findByIdAndUpdate(id, {$pull:{reviews : reviewid}});
    await review.findByIdAndDelete(reviewid);
    req.flash("success","Review deleted successfully");

    res.redirect(`/listings/${id}`); 
    
};