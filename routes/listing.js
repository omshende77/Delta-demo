const express = require('express');
const router = express.Router();
const listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js'); 
const { isLoggedIn, isOwner ,validatelisting } = require('../middleware.js');
const {listingschema} = require('../schema.js');
const ListingController = require('../controllers/listings.js');
const multer = require('multer');
const { storage } = require('../cloudconfig.js');
const upload = multer({ storage });



router.route("/")
//Index route
    .get(wrapAsync (ListingController.index))

//Create route 
    .post(isLoggedIn,upload.single("image"),validatelisting,wrapAsync (ListingController.createListing));



    
//NEW Route
router.get("/new",isLoggedIn,ListingController.renderNewForm);



router.route("/:id")
//Show route
    .get(wrapAsync (ListingController.showListing))

//Delete Route
    .delete(isLoggedIn,isOwner,wrapAsync (ListingController.destroyListing))

//Update route
    .put(isLoggedIn,isOwner,upload.single("image"),validatelisting,wrapAsync (ListingController.updateListing));




//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync (ListingController.renderEditForm));


module.exports = router;