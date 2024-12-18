const express = require("express");
const router = express.Router({mergeParams : true }); 
const wrapAsync =require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js")
const {validateReview, isLoggedIn,isReviewOwner} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")

//Reviews
//Post Reviews Route

router.post("/", isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete Reviews Route
router .delete("/:reviewId",isReviewOwner,wrapAsync(reviewController.destroyReview));

module.exports = router;