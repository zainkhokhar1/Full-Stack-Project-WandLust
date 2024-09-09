
const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review')
const asyncwrap = require('../utils/wrapAsync');
const { reviewSchema } = require('../schema.js');
const Listing = require('../models/listing');
const ExpressError = require('../utils/ExpressError');
const { islogin, isReviewAuthor } = require('../middleware.js');
const reviewControllers = require('../controllers/reviews.js')

const validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    console.log(error);

    if (error) {
        throw new ExpressError(400, error.message);
    }
    else {
        next();
    }
}

// Create Route
router.post('/', validatereview, islogin, asyncwrap(reviewControllers.createReview));

// DELETE Route
router.delete('/:reviewId', islogin, isReviewAuthor, asyncwrap(reviewControllers.deleteReview));

module.exports = router;