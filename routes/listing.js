const express = require('express');
const router = express.Router({ mergeParams: true });
const asyncwrap = require('../utils/wrapAsync');
const { islogin, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controllers/listings.js')
const multer = require('multer')
const { storage } = require('../cloudConfig.js');
const CategoryController = require('../controllers/category.js');
const Listing = require('../models/listing.js');
const { listingSchema } = require('../schema.js');


const upload = multer({ storage })

router.post('/Search', asyncwrap(CategoryController.Search));
router.route('/')
    .get(asyncwrap(listingController.index))
    .post(islogin, upload.single('listing[image]'), asyncwrap(listingController.createNewListing)), validateListing;

//  Create New Listing Form Route
router.get('/new', islogin, listingController.renderNewForm);

router.get('/category/:category', asyncwrap(CategoryController.category));

router.route('/:id')
    .get(asyncwrap(listingController.showListings))
    .delete(islogin, isOwner, asyncwrap(listingController.deleteListing));

router.route('/:id/edit')
    .get(islogin, isOwner, asyncwrap(listingController.render_Edit_Listing_Form))
    .put(islogin, isOwner, upload.single('listing[image]'), validateListing, asyncwrap(listingController.updateListing))


module.exports = router;