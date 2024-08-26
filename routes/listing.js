const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner ,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

router
    .route("/")
    .get(wrapAsync(listingController.index))  //index route
    .post(isLoggedIn,validateListing, wrapAsync(listingController.createNew)); //create new

//CREATE NEW
router.get("/new",isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))  //show route
    .put(isLoggedIn, isOwner, validateListing, 
        wrapAsync(listingController.updateListing))  //update route
    .delete(isLoggedIn, isOwner, 
            wrapAsync(listingController.destroyListing));  //delete route 

//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editForm));


module.exports = router;