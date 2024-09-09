
const Listing = require('../models/listing.js');

module.exports.category = async (req, res) => {
    try {
        let category = req.params.category;
        if (category !== 'Trending') {
            let allListings = await Listing.find({ category: category })
            return res.render('listings/index.ejs', { allListings });
        }
        // Now for getting the top reviews listings
        let listings = await Listing.aggregate([
            {
                $project: {
                    title: 1,
                    description: 1,
                    image: 1,
                    reviews: 1,
                    price: 1,
                    location: 1,
                    owner: 1,
                    reviewsCount: { $size: '$reviews' }
                }
            },
            {
                $sort: {
                    reviewsCount: -1
                }
            },
            {
                $limit: 3
            },
        ])
        if (!listings.length) {
            req.flash('error', 'No Listing Founded');
            return res.redirect('/listings');
        }
        let allListings = [];
        for (let listing of listings) {
            // console.log(listing._id)
            let toplistings = await Listing.findById({ _id: listing._id })
            allListings.push(toplistings)
        }
        return res.render('listings/index.ejs', { allListings })
    }
    catch (e) {
        throw new Error('An error occured')
    }

}

module.exports.Search = async (req, res) => {
    let title = req.body.title;
    const regex = new RegExp(title);
    let allListings = await Listing.find({
        title: { $regex: regex , $options : 'i' }
    })
    if (allListings.length === 0) {
        req.flash('error', 'No listing Founded!');
        return res.redirect('/listings/');
    }
    res.render('listings/index.ejs', { allListings })
}