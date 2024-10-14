const express = require("express");
const router = express.Router( {mergeParams:true});
const asyncWrap = require("../Errors/asyncWrap.js");
const {validateReview , isLoggedIn ,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/review.js")

//review
// creating review
router.post("/",isLoggedIn ,validateReview ,asyncWrap (reviewController.addReview))

// delete review
router.delete("/:reviewId" ,isReviewAuthor , reviewController.deleteReview)

module.exports = router;