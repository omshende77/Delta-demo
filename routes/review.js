const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn,isReviewAuthor,validatereview} = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js");

//CREATE route
router.post("/",isLoggedIn,validatereview,wrapAsync(ReviewController.createReview));

//DELETE route
router.delete("/:reviewid",isLoggedIn,isReviewAuthor,wrapAsync(ReviewController.destroyReview));

module.exports = router;