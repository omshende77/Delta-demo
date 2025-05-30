const express = require('express');
const listing = require('../models/listing.js');
const {listingschema} = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');


// Index route
module.exports.index = async (req,res)=>{
    const allListing = await listing.find({}); 
    res.render("listings/index.ejs",{allListing})
};


// NEW Route
module.exports.renderNewForm = (req,res)=>{
    console.log("Rendering New Listing Form");
    res.render("listings/new.ejs");
};

// CREATE route
module.exports.createListing = async (req,res)=>{
console.log("Form data:", req.body);
let url = req.file.path;
let filename = req.file.filename;
console.log(url,"-----",filename);
let result = listingschema.validate(req.body);
console.log("Validation result:", result);
let {title,description,image,price,country,location} = req.body;
if (result.error) {
    throw new ExpressError(400, result.error);
}
    let newlist = new listing({
        title : title,
        description : description,
        price : price,
        country : country,
        location : location,
        owner: req.user._id,
    });
    newlist.image = {url , filename};
    console.log("CurrUser : ",req.user);
    console.log("Listing of user",newlist);
    
    await newlist.save();
    req.flash("success","New listing created successfully");
    res.redirect("/listings");
};

//Show route
module.exports.showListing = async (req,res)=>{
    const {id} = req.params;
    const findlist = await listing.findById(id).populate({path : "reviews" , populate : {path : "author",},}).populate("owner");
    if (!findlist) {
        req.flash("error","Listing does not Exist");
        return res.redirect("/listings");
    }
    console.log(findlist);
    res.render("listings/show.ejs",{findlist});
    // res.redirect("/listings");
};

//DELETE route
module.exports.destroyListing = async (req,res)=>{
    const id = req.params.id;
    let dlist = await listing.findByIdAndDelete(id);
    console.log(dlist);
    req.flash("success","Listing deleted successfully");
    //logic to delete the review of coresponding listings, but we used middleware.
    // for (let reviewid of dlist.reviews){
    //     console.log("Deleting review with ID:", reviewid);
    //     await review.findByIdAndDelete(reviewid._id);
    // }
    res.redirect("/listings");
};

//Edit Route
module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let list = await listing.findById(id);
    if (!list) {
        req.flash("error","Listing does not Exist");
        return res.redirect("/listings");
    };
    let originalimage = list.image.url;
    originalimage = originalimage.replace("/upload" , "/upload/h_200,w_250");
    res.render("listings/edit.ejs",{list , originalimage});
};

//Update Route
module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let {title,description,image,price,country,location} = req.body;
    //method 1
    let list = await listing.findById(id);
    if(!list){
        throw new ExpressError(404,"Listing not found");
    };
    list.title = title;
    list.description = description;  
    list.price = price;
    list.country = country;
    list.location = location;
    if(typeof req.file !== "undefined"){
        const url = req.file.path;
        const filename = req.file.filename;
        list.image = {url , filename};
        console.log(image);
    }
    await list.save();
    req.flash("success","Listing updated successfully");

    // //method 2
    // await listing.findByIdAndUpdate(id, {
    //     title,
    //     description,
    //     price,
    //     country,
    //     location
    // });
    
    res.redirect("/listings/" + id);
};