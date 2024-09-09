const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const ExpressError = require('./utils/ExpressError.js');

const { listingSchema } = require('./schema.js');

const islogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // console.log(req.user)
        req.flash('error', 'Please login to add a Listing')
        return res.redirect('/login');
    }
    next();
}

const isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash('error', 'Not Authorized User!')
        return res.redirect(`/listings/${id}`);
    }
    next();
}

const isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    console.log(reviewId)
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash('error', 'Not Authorized User!')
        return res.redirect(`/listings/${id}`);
    }
    next();
}

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    // console.log(error);

    if (error) {
        throw new ExpressError(400, error.message);
    }
    else {
        next();
    }
}

module.exports = { islogin, isOwner, isReviewAuthor, validateListing };