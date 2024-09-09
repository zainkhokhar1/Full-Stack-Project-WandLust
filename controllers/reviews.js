const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    // console.log(id)
    let listing_Founded = await Listing.findById(id);
    const review1 = new Review(req.body.review);
    review1.author = req.user._id;
    // console.log(review1)
    listing_Founded.reviews.push(review1);

    await listing_Founded.save();
    await review1.save();
    req.flash('success', 'Review Created!')
    // console.log('Saved Succesfully!');

    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async (req, res) => {

    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted!')
    res.redirect(`/listings/${id}`);
}