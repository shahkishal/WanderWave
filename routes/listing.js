const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('image'), wrapAsync(listingController.createListing));
//New Route 
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.post("/filter/:category_value", listingController.filter);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('image'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, listingController.destroyListing)


//edit route 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;       