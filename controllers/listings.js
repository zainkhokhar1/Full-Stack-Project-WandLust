
const Listing = require('../models/listing.js')

const multer = require('multer')
const { storage } = require('../cloudConfig.js');

const upload = multer({ storage })

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs');
}

module.exports.createNewListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    let category = req.body.category;
    newListing.owner = req.user._id;
    newListing.image = { filename, url };
    newListing.category = category;
    await newListing.save();
    req.flash('success', 'New listing created!');
    res.redirect('/listings');
}

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    // console.log(id)
    let listingFounded = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
    // console.log(listingFounded)
    if (!listingFounded) {
        req.flash('error', 'No listing Founded')
        res.redirect('/listings');
    }
    res.render('listings/show.ejs', { listingFounded });
}

module.exports.render_Edit_Listing_Form = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing not Founded');
        res.redirect('/listings');
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace('/upload', '/upload/w_250')
    res.render('listings/edit.ejs', { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {

    let { id } = req.params;
    // console.log(id)
    // console.log(req.file)
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== 'undefined') {
        let url = req.file.path;
        const filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash('success', 'listing Updated!')
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted!')
    res.redirect('/listings');
}