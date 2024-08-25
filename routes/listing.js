const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner ,validateListing} = require("../middleware.js");


//INDEX ROUTE
router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
}));

//CREATE NEW
router.get("/new",isLoggedIn,(req , res) => {
    res.render("listings/new.ejs");
});

router.post("/", isLoggedIn,
    wrapAsync(async(req, res, next) => {
        let newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings")
}));

//SHOW ROUTE
router.get("/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "This Listing does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}));

//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,
    isOwner,
    wrapAsync(async(req , res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "This Listing does not exist");
        res.redirect("/listings");
    };
    res.render("listings/edit.ejs", {listing});
}));

//update route
router.put("/:id", isLoggedIn, 
    isOwner, validateListing, 
    wrapAsync(async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`)

}));

//DELETE ROUTE
router.delete("/:id", isLoggedIn, 
    isOwner, 
    wrapAsync(async(req, res) => {
    let {id} = req.params;
    let delListings = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;