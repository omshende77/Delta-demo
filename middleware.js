const listing = require("./models/listing");
const user = require("./models/user");
const review = require("./models/review");
const wrapAsync = require("./utils/wrapAsync");
const { listingschema,reviewschema }= require("./schema.js");
const ExpressError = require("./utils/ExpressError");



module.exports.isLoggedIn = (req, res, next) => {
    //console.log(req.path,"..",req.originalUrl);  // ex = /new .. /listings/new = original url is the url we are trying to redirect
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // store the original URL in session
        console.log("Saving to session:", req.originalUrl);
        req.flash("error", "You must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        console.log("Loaded from session:", req.session.redirectUrl);
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next) =>{
    let {id} = req.params;
    let list = await listing.findById(id);
    if(!list.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Owner of the listing..");
        return res.redirect("/listings/" + id);
    };
    next();
}

module.exports.isReviewAuthor = async (req,res,next) =>{
    let {id , reviewid} = req.params;
    const freview = await review.findById(reviewid);   
    if(!freview.author.equals(res.locals.currUser._id)){
        req.flash("error","You did not create this review..");
        return res.redirect("/listings/" + id);
    }
    next();
}

module.exports.validatelisting = (req, res, next) => {
    const { error } = listingschema.validate(req.body);

    if (error) {
        let errdetails = error.details.map((e) => e.message).join(", ");
        throw new ExpressError(404, errdetails);
    } 
    next();
}

module.exports.validatereview = (req, res, next) => {
    const { error } = reviewschema.validate(req.body);
    if (error) {
        let errdetails = error.details.map((e) => e.message).join(", ");
        throw new ExpressError(404, errdetails);
    }
    next();
};