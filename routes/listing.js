const express=require("express");
const router=express.Router();
const Listing = require('../listing.js');
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} =require("../middleware.js");

const listingController=require("../controllers/listings.js");          //using controller to make callbacks moduler
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

//router.route is used to make code more non repeatble
router
    .route("/")
    .get(wrapAsync(listingController.index))//no semicolon here pls                 //index route
    .post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));  //create new listing route

//new route 
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))                                       //show route
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing)) //update route
    .delete(isLoggedIn,isOwner,wrapAsync (listingController.deleteListing));             //delete route

//edit route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync (listingController.renderEditForm));

module.exports=router;